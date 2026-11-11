import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ESPECIAIS, PERICIAS, TRACOS, CAPACIDADE, PONTOS_PARTIDA, TABELA_PARTIDA,
  NIVEIS_PRESENCA, STATUS, CONDICOES, RAIO, DESCANSO,
  deslocamento, dadoForca, pvMaximo, nivelPresenca, capacidadeCarga, medoAtual,
} from '../data/rules.js';
import { MONOMANIAS_DETALHE, EQUIPAMENTOS } from '../data/catalogo.js';
import {
  DESC_PERICIAS, DESC_TRACOS, CONDICOES_SANIDADE, MANIAS, LACUNAS, SONO_PESADELOS, GUIA_RAPIDO,
  CONDICOES_DESC, REGRAS, regiaoCorpo,
} from '../data/regras.js';
import { testePericia, rolarExpr, rolarDano, rolar, detalheRolagem, ORDEM_RESULTADO } from '../lib/dice.js';
import { salvar } from '../lib/storage.js';
import Icon from './Icon.jsx';

const num = (v, min = 0, max = 999) => Math.min(max, Math.max(min, Number(v) || 0));
const pct = (a, m) => (m > 0 ? Math.min(100, Math.max(0, (a / m) * 100)) : 0);
const COR_TRACO = { PER: '#f5d76e', AUD: '#ef2b3c', DET: '#ff8c1a', VIR: '#3ddc84', DES: '#a66cff', RAC: '#4c9aff' };

const catalogo = (nome) => EQUIPAMENTOS.find((x) => x.nome === nome);
// melhorias entram na carga do item; itens com quantidade (categoria 0) multiplicam a carga
const cargaItem = (it) => num(it.carga) * (it.qtd ?? 1) + (it.melhorias || []).reduce((s, n) => s + num(catalogo(n)?.carga), 0);
const GRUPO_MELHORIAS = { 'Armas de Fogo': 'Modificações de Armas de Fogo', 'Armas Brancas': 'Melhorias de Armas Brancas' };
const GRUPOS_OCULTOS = Object.values(GRUPO_MELHORIAS);
const grupoMelhorias = (it) => {
  const c = catalogo(it.nome);
  return c && c.nome !== 'Caixa de Munição/Pente' ? GRUPO_MELHORIAS[c.categoria] || null : null;
};

const ABAS = [
  { id: 'ficha', nome: 'Ficha' },
  { id: 'mono', nome: 'Monomanias' },
  { id: 'inv', nome: 'Inventário' },
  { id: 'combate', nome: 'Combate' },
  { id: 'notas', nome: 'Notas' },
  { id: 'regras', nome: 'Regras' },
];

// botão que repete enquanto estiver pressionado (acelera aos poucos)
function Rb({ onClick, className = 'rb', children, ...rest }) {
  const fn = useRef(onClick);
  fn.current = onClick;
  const timer = useRef(null);
  const parar = () => {
    clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => parar, []);
  const iniciar = (ev) => {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    parar();
    fn.current();
    let passos = 0;
    const laco = () => {
      fn.current();
      passos += 1;
      timer.current = setTimeout(laco, passos > 20 ? 40 : passos > 8 ? 70 : 130);
    };
    timer.current = setTimeout(laco, 420);
  };
  return (
    <button type="button" className={className} {...rest}
      onPointerDown={iniciar} onPointerUp={parar} onPointerLeave={parar} onPointerCancel={parar}
      onContextMenu={(ev) => ev.preventDefault()}
      onClick={(ev) => { if (ev.detail === 0) fn.current(); }}>
      {children === '+' || children === '−' ? (
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" className="sinal">
          <path d={children === '+' ? 'M6 1.5v9M1.5 6h9' : 'M1.5 6h9'} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </svg>
      ) : children}
    </button>
  );
}

function Stepper({ valor, onChange, min = 0, max = 999, passo = 1 }) {
  return (
    <div className="stepper">
      <Rb className="" aria-label="Diminuir" onClick={() => onChange(num(valor - passo, min, max))}>−</Rb>
      <input type="number" inputMode="numeric" value={valor} onChange={(e) => onChange(num(e.target.value, min, max))} />
      <Rb className="" aria-label="Aumentar" onClick={() => onChange(num(valor + passo, min, max))}>+</Rb>
    </div>
  );
}

// valor 1–18 com + / − e botão de dado (usado em atributos e perícias)
function Linha({ nome, sub, valor, onChange, onRolar, destaque }) {
  return (
    <div className={`ln ${destaque || ''}`}>
      <div className="ln-n"><b title={DESC_PERICIAS[nome] ?? DESC_PERICIAS[ESPECIAIS.find((s) => s.key === nome)?.nome]}>{nome}</b>{sub && <small>{sub}</small>}</div>
      <div className="ln-c">
        <Rb className="rb sm" onClick={() => onChange(num(valor - 1, 1, 18))} aria-label={`Diminuir ${nome}`}>−</Rb>
        <input className="ln-v" type="number" inputMode="numeric" value={valor} aria-label={nome}
          onChange={(e) => onChange(num(e.target.value, 1, 18))} />
        <Rb className="rb sm" onClick={() => onChange(num(valor + 1, 1, 18))} aria-label={`Aumentar ${nome}`}>+</Rb>
      </div>
      <button className="dado" onClick={onRolar} aria-label={`Rolar ${nome}`}><img src="/img/dado.png" alt="" /></button>
    </div>
  );
}

function Vit({ rotulo, valor, max, aviso, onMais, onMenos, extra, desabilitado = false }) {
  return (
    <div className={`vit ${extra ? 'com-extra' : ''}`}>
      <div className="vit-r">{rotulo}{aviso && <span className="vit-a">{aviso}</span>}</div>
      <div className="vit-v">{valor}{max != null && <small>/{max}</small>}</div>
      <div className="par">
        <Rb onClick={onMenos} disabled={desabilitado} aria-label={`Diminuir ${rotulo}`}>−</Rb>
        <Rb onClick={onMais} disabled={desabilitado} aria-label={`Aumentar ${rotulo}`}>+</Rb>
      </div>
      {extra}
    </div>
  );
}

function Resultado({ r, onClose }) {
  if (!r) return null;
  return (
    <div className="popup" onClick={onClose}>
      <div className={`popup-box ${r.resultado ? `glow-${r.resultado}` : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="x fechar" onClick={onClose} aria-label="Fechar">✕</button>
        <img src="/img/d20-icon.145d47e0.png" alt="" className="giro" />
        <h3>{r.nome}</h3>
        {r.tipo === 'teste' ? (
          <>
            <div className="dados">
              {(r.d20s || [r.d20]).map((v, i, arr) => {
                const mantido = arr.length === 1 || (v === r.d20 && i === arr.indexOf(r.d20));
                return <span className={`d ${mantido ? '' : 'descartado'}`} key={i}>d20 · {v}</span>;
              })}
              {r.extras.map((e, i) => <span className="d" key={i}>d6 · {e}</span>)}
            </div>
            {r.vant ? <p className="detalhe">{r.vant > 0 ? `Vantagem ×${r.vant}: maior d20` : `Desvantagem ×${-r.vant}: menor d20`}</p> : null}
            <div className="total">{r.total}</div>
            <div className={`res res-${r.resultado}`}>{r.resultado}</div>
            {r.dt && <p className={`dt ${r.sucesso ? 'ok' : 'falha'}`}>DT {r.dt}: {r.sucesso ? 'Sucesso' : 'Fracasso'}</p>}
          </>
        ) : r.tipo === 'info' ? (
          <>
            <div className="dados">{(r.dados || []).map((d, i) => <span className="d" key={i}>{d}</span>)}</div>
            {r.total != null && <div className="total">{r.total}</div>}
          </>
        ) : (
          <>
            <div className="dados">
              {r.partes.map((p, i) => p.fixo != null
                ? <span className="d fixo" key={i}>{p.sinal < 0 ? '−' : '+'} {p.fixo}</span>
                : p.dados.map((d, j) => <span className="d" key={`${i}-${j}`} title={`d${p.lados}`}>{p.sinal < 0 ? '−' : ''}{d}<small>d{p.lados}</small></span>))}
            </div>
            <div className="total">{r.total}</div>
            <p className="detalhe">{detalheRolagem(r)}</p>
          </>
        )}
        {r.nota && <p className="nota">{r.nota}</p>}
      </div>
    </div>
  );
}

function Card({ titulo, sub, children, className = '' }) {
  return (
    <section className={`card-s ${className}`}>
      {titulo && <h2>{titulo}{sub && <small>{sub}</small>}</h2>}
      {children}
    </section>
  );
}

// Card que o usuário pode minimizar; o estado lembra enquanto a página estiver aberta
const estadoColap = {};
function Colapsavel({ id, titulo, sub, padrao = false, children }) {
  const [aberto, setAberto] = useState(estadoColap[id] ?? padrao);
  const alternar = () => {
    estadoColap[id] = !aberto;
    setAberto(!aberto);
  };
  return (
    <section className={`card-s colap ${aberto ? 'aberto' : ''}`}>
      <button type="button" className="colap-h" onClick={alternar} aria-expanded={aberto}>
        <span>{titulo}{sub && <small>{sub}</small>}</span>
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {aberto && <div className="colap-c">{children}</div>}
    </section>
  );
}

export default function Sheet({ inicial, remota, mestre, conectado, onVoltar }) {
  const [f, setF] = useState(inicial);
  const [estado, setEstado] = useState('salvo');
  const [aba, setAba] = useState('ficha');
  const [res, setRes] = useState(null);
  const [hist, setHist] = useState([]);
  const [pulsoesUso, setPulsoesUso] = useState(0);
  const [vant, setVant] = useState(0);
  const [dtSel, setDtSel] = useState('');
  const [combinar, setCombinar] = useState('');
  const [danoExpr, setDanoExpr] = useState('2d6');
  const [danoRes, setDanoRes] = useState('Normal');
  const [danoExtra, setDanoExtra] = useState(0);
  const [danoPv, setDanoPv] = useState(0);
  const [avisoLesao, setAvisoLesao] = useState(null);
  const [danoErro, setDanoErro] = useState(false);
  const [expr, setExpr] = useState('2d6 + 1d12');
  const [exprErro, setExprErro] = useState(false);
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState('az');
  const primeira = useRef(true);
  const vindoDeFora = useRef(false);
  const visto = useRef(inicial.updatedAt || 0);
  const audio = useRef(null);

  // alterações feitas por outra pessoa (jogador/mestre) chegam ao vivo
  useEffect(() => {
    if (!remota || (remota.updatedAt || 0) <= visto.current) return;
    visto.current = remota.updatedAt;
    vindoDeFora.current = true;
    setF(remota);
  }, [remota]);

  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    if (vindoDeFora.current) {
      vindoDeFora.current = false;
      return;
    }
    setEstado('salvando');
    const t = setTimeout(async () => {
      const ts = await salvar(f);
      if (ts) visto.current = Math.max(visto.current, ts);
      setEstado(ts ? 'salvo' : 'erro');
    }, 600);
    return () => clearTimeout(t);
  }, [f]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [aba]);

  const set = (k, v) => setF((o) => ({ ...o, [k]: v }));
  const setIn = (k, sub, v) => setF((o) => ({ ...o, [k]: { ...o[k], [sub]: v } }));

  const e = f.especiais;
  const pvMax = pvMaximo(e.VIG) + num(f.pv.extra);
  const nivel = nivelPresenca(e.PRE, e.INT, e.VON);
  const cargaUsada = f.inventario.reduce((s, i) => s + cargaItem(i), 0);
  const categoriaTotal = f.inventario.reduce((s, i) =>
    s + num(i.cat) * (i.qtd ?? 1) + (i.melhorias || []).reduce((total, nome) => total + num(catalogo(nome)?.cat), 0), 0);
  const bonusCarga = f.inventario.reduce((s, i) => s + num(i.bonus), 0);
  const { corpo: capCorpo, total: capTotal, limite: capLimite } = capacidadeCarga(e.FOR, bonusCarga);
  const medo = medoAtual(f.ps.atual);

  // Ponto de Partida: as 36 perícias (30 + 6 especiais) devem respeitar quantas vezes cada valor pode repetir
  const usosPartida = useMemo(() => {
    const cont = {};
    [...Object.values(f.pericias), ...Object.values(e)].forEach((v) => (cont[v] = (cont[v] || 0) + 1));
    return cont;
  }, [f.pericias, e]);
  const limitePartida = (v) => TABELA_PARTIDA[v]?.[f.pontoPartida] ?? 0;
  const excessos = Object.entries(usosPartida).filter(([v, q]) => q > limitePartida(v));
  const totalPartida = Object.values(usosPartida).reduce((s, q) => s + q, 0);

  useEffect(() => {
    if (f.pv.atual > pvMax) setIn('pv', 'atual', pvMax);
  }, [pvMax]);

  const listaPericias = useMemo(() => {
    const b = busca.trim().toLowerCase();
    return PERICIAS.filter((p) => p.toLowerCase().includes(b)).sort((a, c) =>
      ordem === 'valor' ? f.pericias[c] - f.pericias[a] || a.localeCompare(c, 'pt-BR') : a.localeCompare(c, 'pt-BR'));
  }, [busca, ordem, f.pericias]);

  const mostrar = (r) => {
    setRes(r);
    setHist((h) => [r, ...h].slice(0, 20));
    if (audio.current) {
      audio.current.currentTime = 0;
      audio.current.play().catch(() => {});
    }
  };
  // vantagens/desvantagens automáticas: status positivo/negativo do atributo e a condição Exaustão
  const vantagemAuto = (nomes) => {
    const notas = [];
    let v = 0;
    for (const n of nomes) {
      const st = STATUS.find((s) => s.attr === n);
      const val = f.status[n];
      if (st && val === 'bom') { v += 1; notas.push(`${st.bom}: +1 vantagem em ${n}`); }
      if (st && val === 'ruim') { v -= 1; notas.push(`${st.ruim}: +1 desvantagem em ${n}`); }
    }
    if (f.condicoes.includes('Exaustão')) { v -= 1; notas.push('Exaustão: 1 desvantagem em todos os testes'); }
    return { v, notas };
  };
  const testar = (nome, valor) => {
    const gastar = Math.min(pulsoesUso, Math.max(0, f.pulsoes.atual));
    if (gastar) setIn('pulsoes', 'atual', f.pulsoes.atual - gastar);
    let v = valor;
    let titulo = nome;
    const nomes = [nome];
    const esp = ESPECIAIS.find((s) => s.key === combinar);
    if (esp && esp.nome !== nome) {
      v = Math.round((valor + e[esp.key]) / 2);
      titulo = `${nome} + ${esp.nome} (média ${v})`;
      nomes.push(esp.nome);
    }
    const auto = vantagemAuto(nomes);
    const liquido = Math.max(-5, Math.min(5, vant + auto.v));
    const r = testePericia(titulo, v, gastar, liquido, dtSel || null);
    if (auto.notas.length) r.nota = auto.notas.join('\n');
    mostrar(r);
    setPulsoesUso(0);
    setVant(0);
    setDtSel('');
    setCombinar('');
  };

  // Iniciativa = d20 + valor da perícia Preparação (soma direta, sem classificação de sucesso)
  const iniciativa = () => {
    const prep = f.pericias['Preparação'];
    const r = rolarExpr(`1d20+${prep}`);
    mostrar({ ...r, nome: 'Iniciativa (d20 + Preparação)', nota: `Empate: vence quem tiver maior Preparação (${prep}); se também empatar, rolem novamente.` });
  };

  const localizar = () => {
    const n = rolar(10);
    mostrar({ tipo: 'info', nome: 'Localização (d10)', dados: [`d10 · ${n}`], total: n, nota: regiaoCorpo(n), detalhe: regiaoCorpo(n) });
  };

  const rolarDanoAtaque = () => {
    const r = rolarDano(danoExpr, danoRes, num(danoExtra, 0, 10));
    setDanoErro(!r);
    if (r) mostrar(r);
  };

  const rolarSono = () => {
    const r = testePericia('Teste de sono (Vontade)', e.VON, 0, vantagemAuto(['Vontade']).v);
    r.nota = `Pesadelos Frequentes: ${SONO_PESADELOS[r.resultado]}`;
    mostrar(r);
  };
  const rolarMania = () => {
    const n = rolar(10);
    const m = MANIAS[n - 1];
    mostrar({ tipo: 'info', nome: 'Mania Inabitual (d10)', dados: [`d10 · ${n}`], total: n, nota: `${m.frase}\n\n${m.efeito}`, detalhe: m.efeito.slice(0, 60) });
  };
  const rolarLacuna = () => {
    const n = rolar(3);
    mostrar({ tipo: 'info', nome: 'Lacuna de Memória (d3)', dados: [`d3 · ${n}`], total: n, nota: LACUNAS[n - 1], detalhe: LACUNAS[n - 1].slice(0, 60) });
  };
  // Item de categoria 0: a quantidade (1d4) é rolada sozinha ao adicionar
  const adicionarItem = (it) => {
    let novo = it;
    if (String(it.cat) === '0') {
      const n = rolar(4);
      novo = { ...it, qtd: n };
      mostrar({ tipo: 'info', nome: `Quantidade: ${it.nome}`, dados: [`d4 · ${n}`], total: n, nota: `Você possui ${n} unidade(s).`, detalhe: `${n} unidade(s)` });
    }
    set('inventario', [...f.inventario, novo]);
  };
  const addMelhoria = (i, nome) => updItem(i, { melhorias: [...(f.inventario[i].melhorias || []), nome] });
  const delMelhoria = (i, nome) => updItem(i, { melhorias: (f.inventario[i].melhorias || []).filter((n) => n !== nome) });

  const aplicarDano = () => {
    const d = num(danoPv, 0, 999);
    if (!d || f.pv.morto) return;
    const tipo = d >= pvMax ? 'Fatal' : d >= pvMax / 2 ? 'Grave' : 'Comum';
    const novo = f.pv.atual - d;
    const lesaoGrave = Boolean(f.pv.lesaoGrave) || tipo === 'Grave';
    const morreu = tipo === 'Fatal' || (novo <= 0 && lesaoGrave);
    const avisos = [`Lesão ${tipo}: dano ${d} contra vida máxima ${pvMax}.`];
    if (tipo === 'Fatal') avisos.push('Dano igual ou superior à vida máxima: morte imediata.');
    else if (novo <= 0 && lesaoGrave) avisos.push('Estado de Morrendo com Lesão Grave: morte imediata.');
    else if (tipo === 'Grave') avisos.push('Lesão Grave: se entrar no Estado de Morrendo com ela, a morte é imediata. Estabilizar cura apenas 1 PV.');
    if (!morreu && novo <= 0) {
      avisos.push(f.pv.atual > 0
        ? 'Estado de Morrendo: ganha 1 Rodada de Imunidade; depois, testes de Vigor para continuar vivo até voltar a 1 PV.'
        : 'Continua no Estado de Morrendo; faça testes de Vigor para continuar vivo até voltar a 1 PV.');
    }
    else if (!morreu && novo >= 1 && novo <= 3) avisos.push('PV entre 1 e 3: desmaio instantâneo. Teste de Vigor até obter sucesso para voltar à consciência (crítico: Ação Livre).');
    setAvisoLesao(avisos.join('\n'));
    setF((o) => ({ ...o, pv: {
      ...o.pv,
      atual: o.pv.atual - d,
      lesaoGrave: Boolean(o.pv.lesaoGrave) || tipo === 'Grave',
      morto: Boolean(o.pv.morto) || morreu,
      vidaAntesMorte: morreu ? o.pv.atual : o.pv.vidaAntesMorte,
    } }));
    setDanoPv(0);
  };
  const reverterMorte = () => {
    setF((o) => ({
      ...o,
      pv: {
        ...o.pv,
        atual: Math.min(pvMax, Math.max(1, Number(o.pv.vidaAntesMorte) || o.pv.atual)),
        morto: false,
        vidaAntesMorte: null,
      },
    }));
    setAvisoLesao(null);
  };
  const aplicarCura = () => {
    const c = num(danoPv, 0, 999);
    if (!c || f.pv.morto) return;
    setAvisoLesao(null);
    setF((o) => ({ ...o, pv: { ...o.pv, atual: Math.min(pvMax, o.pv.atual + c) } }));
    setDanoPv(0);
  };

  const rolarLivre = () => {
    const r = rolarExpr(expr);
    setExprErro(!r);
    if (r) mostrar(r);
  };

  const exportar = () => {
    const blob = new Blob([JSON.stringify(f, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${f.nome || 'ficha'}-monomania.json`;
    a.click();
  };
  const foto = (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 600 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = img.width * s;
      c.height = img.height * s;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      set('foto', c.toDataURL('image/jpeg', 0.82));
    };
    img.src = URL.createObjectURL(file);
  };

  const addMono = (traco, nome, desc) => setF((o) => ({ ...o, monomanias: [...o.monomanias, { traco, nome, desc }] }));
  const updMono = (i, patch) =>
    setF((o) => ({ ...o, monomanias: o.monomanias.map((m, j) => (j === i ? { ...m, ...patch } : m)) }));
  const delMono = (i) => setF((o) => ({ ...o, monomanias: o.monomanias.filter((_, j) => j !== i) }));
  const updItem = (i, patch) =>
    setF((o) => ({ ...o, inventario: o.inventario.map((it, j) => (j === i ? { ...it, ...patch } : it)) }));
  const toggleCond = (c) =>
    set('condicoes', f.condicoes.includes(c) ? f.condicoes.filter((x) => x !== c) : [...f.condicoes, c]);

  const pvAlerta = f.pv.morto ? 'Morto' : f.pv.atual <= 0 ? 'Morrendo' : f.pv.atual <= 3 ? 'Risco de desmaio' : null;
  const mudaPV = (d) => {
    if (f.pv.morto) return;
    setF((o) => {
      const atual = Math.min(pvMax, o.pv.atual + d);
      const morreu = d < 0 && atual <= 0 && Boolean(o.pv.lesaoGrave);
      return {
        ...o,
        pv: {
          ...o.pv,
          atual,
          morto: Boolean(o.pv.morto) || morreu,
          vidaAntesMorte: morreu ? o.pv.atual : o.pv.vidaAntesMorte,
        },
      };
    });
  };
  const mudaPS = (d) => setF((o) => ({ ...o, ps: { ...o.ps, atual: num(o.ps.atual + d, 0, 100) } }));
  const mudaPU = (d) => setF((o) => ({ ...o, pulsoes: { ...o.pulsoes, atual: Math.max(0, o.pulsoes.atual + d) } }));
  const mudaPP = (d) => setF((o) => {
    const v = o.pp.atual + d;
    return { ...o, pp: { ...o.pp, atual: Math.max(0, o.pp.max ? Math.min(o.pp.max, v) : v) } };
  });
  const contadores = f.contadores || [];
  const mudaContador = (id, d) => setF((o) => ({
    ...o, contadores: (o.contadores || []).map((c) => (c.id === id ? { ...c, atual: Math.max(0, c.atual + d) } : c)),
  }));
  const novoContador = () => {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    setF((o) => ({ ...o, contadores: [...(o.contadores || []), { id, nome: 'Contador', atual: 0 }] }));
  };
  const renomearContador = (id, nome) =>
    setF((o) => ({ ...o, contadores: (o.contadores || []).map((c) => (c.id === id ? { ...c, nome: nome.slice(0, 30) } : c)) }));
  const removerContador = (id) => {
    if (!window.confirm('Remover este contador?')) return;
    setF((o) => ({ ...o, contadores: (o.contadores || []).filter((c) => c.id !== id) }));
  };
  const irParaPericias = () => document.getElementById('pericias')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="app-ficha">
      <audio ref={audio} src="/audio/dice-roll.mp3" preload="auto" />
      <Resultado r={res} onClose={() => setRes(null)} />

      <header className="topbar">
        <button className="ic-btn" onClick={onVoltar} aria-label="Voltar"><Icon nome="voltar" /></button>
        <nav className="abas-nav" aria-label="Seções da ficha">
          {ABAS.map((a) => (
            <button key={a.id} className={aba === a.id ? 'ativa' : ''} onClick={() => setAba(a.id)}>{a.nome}</button>
          ))}
        </nav>
        <small className={`estado ${estado}`}>
          {estado === 'salvando' ? 'Salvando…' : estado === 'erro' ? 'Erro ao salvar' : 'Salvo'}
          {mestre && f.donoNome ? ` · ${f.donoNome}` : ''}
          <span className={`ponto ${conectado ? 'on' : 'off'}`} title={conectado ? 'Ao vivo' : 'Reconectando…'} />
        </small>
        <button className="ic-btn" onClick={exportar} aria-label="Exportar"><Icon nome="baixar" /></button>
        {aba !== 'ficha' && (
          <div className="faixa">
            <span>PV <b>{f.pv.atual}/{pvMax}</b></span>
            <span>PS <b>{f.ps.atual}%</b></span>
            <span>PU <b>{f.pulsoes.atual}</b></span>
            <span>PP <b>{f.pp.atual}</b></span>
            {contadores.map((c) => <span key={c.id}>{c.nome} <b>{c.atual}</b></span>)}
          </div>
        )}
      </header>

      <main className="conteudo" key={aba}>
        {aba === 'ficha' && (
          <>
            <section className="fx-cab">
              <input className="fx-nome" placeholder="Nome" aria-label="Nome" value={f.nome} onChange={(ev) => set('nome', ev.target.value)} />
              <div className="fx-infos">
                {[['idade', 'Idade'], ['alturaPeso', 'Altura e peso'], ['campanha', 'Campanha'], ['jogador', 'Jogador']].map(([k, l]) => (
                  <input key={k} placeholder={l} aria-label={l} value={f[k]} onChange={(ev) => set(k, ev.target.value)} />
                ))}
              </div>
            </section>

            <section className="fx-grade">
              <div className="fx-attr">
                <h3 className="rot">Atributos</h3>
                {ESPECIAIS.map((s) => (
                  <Linha key={s.key} nome={s.key} sub={CAPACIDADE[e[s.key]]} valor={e[s.key]}
                    onChange={(v) => setIn('especiais', s.key, v)} onRolar={() => testar(s.nome, e[s.key])} />
                ))}
                <div className="fx-der">
                  <span>Desloc. <b>{deslocamento(e.AGI)} m</b></span>
                  <span>Dado de Força <b>{dadoForca(e.FOR)}</b></span>
                  <span>Carga <b>{cargaUsada}/{capTotal}</b></span>
                  <span title={NIVEIS_PRESENCA[nivel]}>Presença <b>Nv {nivel}</b></span>
                </div>
              </div>

              <div className="fx-vit">
                <Vit rotulo="PV" valor={f.pv.atual} max={pvMax} aviso={pvAlerta} onMais={() => mudaPV(1)} onMenos={() => mudaPV(-1)}
                  extra={f.pv.morto && <strong className="estado-morto">PERSONAGEM MORTO</strong>} desabilitado={f.pv.morto} />
                <Vit rotulo="PS" valor={`${f.ps.atual}%`} aviso={medo && `Medo ${medo.nivel}`} onMais={() => mudaPS(1)} onMenos={() => mudaPS(-1)} />
                <Vit rotulo="PU" valor={f.pulsoes.atual} onMais={() => mudaPU(1)} onMenos={() => mudaPU(-1)} />
                <Vit rotulo="PP" valor={f.pp.atual} max={f.pp.max || null} onMais={() => mudaPP(1)} onMenos={() => mudaPP(-1)} />
                {contadores.map((c) => (
                  <Vit key={c.id} rotulo={c.nome} valor={c.atual}
                    onMais={() => mudaContador(c.id, 1)} onMenos={() => mudaContador(c.id, -1)}
                    extra={
                      <div className="vit-ed">
                        <input value={c.nome} aria-label="Nome do contador" onChange={(ev) => renomearContador(c.id, ev.target.value)} />
                        <button className="x" onClick={() => removerContador(c.id)} aria-label={`Remover ${c.nome}`}>✕</button>
                      </div>
                    } />
                ))}
                <button className="sec vit-add" onClick={novoContador} aria-label="Adicionar contador">+ Contador</button>
              </div>

              <aside className="fx-ret">
                <label className="fx-foto" title="Trocar imagem">
                  <img src={f.foto || '/img/character3.png'} alt="Personagem" />
                  <input type="file" accept="image/*" hidden onChange={foto} />
                </label>
                <div className="fx-pilula" role="radiogroup" aria-label="Ponto de Partida">
                  {PONTOS_PARTIDA.map((p, i) => (
                    <button key={p} role="radio" aria-checked={f.pontoPartida === i} title={p}
                      className={f.pontoPartida === i ? 'on' : ''} onClick={() => set('pontoPartida', i)} />
                  ))}
                </div>
                <small className="fx-pp-nome">{PONTOS_PARTIDA[f.pontoPartida]}</small>
              </aside>
            </section>

            <button className="seta" onClick={irParaPericias} aria-label="Ir para perícias"><Icon nome="baixo" /></button>

            <details className="fx-mais">
              <summary>Mais detalhes</summary>
              <div className="campos">
                <label>PV extra<Stepper valor={f.pv.extra} max={50} onChange={(v) => setIn('pv', 'extra', v)} /></label>
                <label>PP máximo<Stepper valor={f.pp.max} onChange={(v) => setIn('pp', 'max', v)} /></label>
                <label>Nota de PV<input value={f.pv.nota} onChange={(ev) => setIn('pv', 'nota', ev.target.value)} /></label>
                <label>Nota de PS<input value={f.ps.nota} onChange={(ev) => setIn('ps', 'nota', ev.target.value)} /></label>
                <label>Nota de Pulsões<input value={f.pulsoes.nota} onChange={(ev) => setIn('pulsoes', 'nota', ev.target.value)} /></label>
                <label>Nota de PP<input value={f.pp.nota} onChange={(ev) => setIn('pp', 'nota', ev.target.value)} /></label>
                <label className="larga">Aparência e Personalidade
                  <textarea rows="3" value={f.aparencia} onChange={(ev) => set('aparencia', ev.target.value)} />
                </label>
              </div>
              {medo && (
                <div className="sanidade">
                  <p className="alerta">Potencial de Medo Nv {medo.nivel}: {medo.nome}</p>
                  {CONDICOES_SANIDADE.filter((c) => c.nivel <= medo.nivel).map((c) => (
                    <details key={c.nivel} className="cond-san">
                      <summary>Nv {c.nivel} · {c.nome} <small>(abaixo de {c.abaixo}%)</small></summary>
                      <p className="nota">{c.texto}</p>
                    </details>
                  ))}
                  <div className="acoes-rapidas">
                    {medo.nivel >= 3 && <button className="sec" onClick={rolarSono}><Icon nome="dice" /> Teste de sono (Vontade)</button>}
                    {medo.nivel >= 5 && <button className="sec" onClick={rolarMania}><Icon nome="dice" /> Mania Inabitual (d10)</button>}
                    {medo.nivel >= 6 && <button className="sec" onClick={rolarLacuna}><Icon nome="dice" /> Lacuna de Memória (d3)</button>}
                  </div>
                </div>
              )}
              <table className="descanso">
                <thead><tr><th>Sono</th><th>PV</th><th>PS</th></tr></thead>
                <tbody>{DESCANSO.map((d) => <tr key={d.h}><td>{d.h}</td><td>{d.pv}</td><td>{d.ps}</td></tr>)}</tbody>
              </table>
              {f.foto && <button className="sec" onClick={() => set('foto', '')}>Remover imagem</button>}
            </details>

            <section id="pericias" className="fx-per">
              <div className="fx-per-h">
                <h3 className="rot">Perícias</h3>
                <input className="busca" type="search" placeholder="Buscar…" aria-label="Buscar perícia" value={busca} onChange={(ev) => setBusca(ev.target.value)} />
                <div className="segmento">
                  <button className={ordem === 'az' ? 'ativa' : ''} onClick={() => setOrdem('az')}>A–Z</button>
                  <button className={ordem === 'valor' ? 'ativa' : ''} onClick={() => setOrdem('valor')}>Valor</button>
                </div>
                <label className="fx-pu">Gastar PU<Stepper valor={pulsoesUso} max={Math.max(0, f.pulsoes.atual)} onChange={setPulsoesUso} /></label>
              </div>
              <div className="fx-per-h fx-opcoes">
                <label className="fx-pu" title="Positivo = vantagens (maior d20); negativo = desvantagens (menor d20)">Vant. / Desv.<Stepper valor={vant} min={-3} max={3} onChange={setVant} /></label>
                <label className="fx-pu">DT
                  <select value={dtSel} onChange={(ev) => setDtSel(ev.target.value)}>
                    <option value="">Sem DT</option>
                    {['Normal', 'Bom', 'Extremo', 'Crítico'].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
                <label className="fx-pu" title="Perícias Especiais podem ser usadas em conjunto: faz a média dos dois valores">Média com
                  <select value={combinar} onChange={(ev) => setCombinar(ev.target.value)}>
                    <option value="">—</option>
                    {ESPECIAIS.map((s) => <option key={s.key} value={s.key}>{s.nome}</option>)}
                  </select>
                </label>
                <small className="fx-dica">Vale só para o próximo teste. Status do atributo e Exaustão entram sozinhos.</small>
              </div>
              <details className="dist">
                <summary>
                  {excessos.length > 0
                    ? <p className="alerta">Ponto de Partida {PONTOS_PARTIDA[f.pontoPartida]}: {excessos.length} {excessos.length === 1 ? 'valor passa' : 'valores passam'} do limite (toque para ver a distribuição)</p>
                    : <p className="rot">Ponto de Partida {PONTOS_PARTIDA[f.pontoPartida]} · distribuição OK ({totalPartida}/36)</p>}
                </summary>
                <div className="grid-d">
                  {[[1, 9], [10, 18]].map(([a, b]) => (
                    <table key={a}>
                      <thead><tr><th>Valor</th><th>Usos</th><th>Máx.</th></tr></thead>
                      <tbody>
                        {Array.from({ length: b - a + 1 }, (_, i) => a + i).map((v) => {
                          const q = usosPartida[v] || 0;
                          return <tr key={v} className={q > limitePartida(v) ? 'exc' : ''}><td>{v}</td><td>{q}</td><td>{limitePartida(v)}</td></tr>;
                        })}
                      </tbody>
                    </table>
                  ))}
                </div>
              </details>
              <div className="fx-lista">
                {listaPericias.map((p) => (
                  <Linha key={p} nome={p} sub={CAPACIDADE[f.pericias[p]]} valor={f.pericias[p]}
                    destaque={`nv-${Math.min(4, Math.floor(f.pericias[p] / 4))}`}
                    onChange={(v) => setIn('pericias', p, v)} onRolar={() => testar(p, f.pericias[p])} />
                ))}
                {!listaPericias.length && <p className="vazio">Nenhuma perícia encontrada.</p>}
              </div>
            </section>
          </>
        )}

        {aba === 'mono' && (
          <>
            <Card titulo="Monomanias" sub={`${f.monomanias.length} / ${nivel} · Presença Mental Nv ${nivel}`}>
              {f.monomanias.length > nivel && <p className="alerta">Monomanias acima do nível de Presença Mental.</p>}
              <MonoAdd onAdd={addMono} />
            </Card>
            {f.monomanias.map((m, i) => (
              <article className="mono" key={i} style={{ '--cor': COR_TRACO[m.traco] }}>
                <div className="mono-h">
                  <b>{m.nome}</b>
                  <span className="chip">{TRACOS.find((t) => t.key === m.traco)?.nome}</span>
                  <button className="x" onClick={() => delMono(i)} aria-label="Remover">✕</button>
                </div>
                <textarea rows={Math.min(10, Math.max(2, Math.ceil(m.desc.length / 60)))} placeholder="Descrição / efeito"
                  value={m.desc} onChange={(ev) => updMono(i, { desc: ev.target.value })} />
              </article>
            ))}
            {!f.monomanias.length && <p className="vazio">Nenhuma monomania ainda. Escolha um Traço acima.</p>}
          </>
        )}

        {aba === 'inv' && (
          <>
            <Card titulo="Carga" sub={`${cargaUsada} / ${capTotal} · só corpo: ${capCorpo} · limite absoluto ${capLimite} · Categoria total: ${categoriaTotal}`}>
              <div className={`barra grande ${cargaUsada > capTotal ? 'over' : ''}`}><i style={{ width: `${pct(cargaUsada, capTotal)}%` }} /></div>
              {cargaUsada > capTotal && <p className="alerta">{cargaUsada > capLimite ? 'Acima do limite absoluto (o dobro da capacidade)!' : 'Sobrecarregado: penalidades.'}</p>}
              {cargaUsada > capCorpo && bonusCarga === 0 && <p className="alerta">Acima do que cabe no corpo e bolsos ({capCorpo}). Adicione mochila, pochete ou similar.</p>}
              <EquipAdd onAdd={adicionarItem} />
              <button className="sec" onClick={() => set('inventario', [...f.inventario, { nome: '', cat: '', carga: '', anotacao: '' }])}>+ Item em branco</button>
            </Card>
            {f.inventario.map((it, i) => (
              <article className="item-card" key={i}>
                <div className="item">
                  <input className="it-nome" placeholder="Nome do item" value={it.nome} onChange={(ev) => updItem(i, { nome: ev.target.value })} />
                  <button className="x" onClick={() => set('inventario', f.inventario.filter((_, j) => j !== i))} aria-label="Remover">✕</button>
                </div>
                <div className={`campos mini ${it.qtd != null ? 'tres' : ''}`}>
                  <label>Categoria<input type="number" inputMode="numeric" value={it.cat} onChange={(ev) => updItem(i, { cat: ev.target.value })} /></label>
                  <label>Carga<input type="number" inputMode="numeric" value={it.carga} onChange={(ev) => updItem(i, { carga: ev.target.value })} /></label>
                  {it.qtd != null && (
                    <label>Quantidade<input type="number" inputMode="numeric" min="1" value={it.qtd} onChange={(ev) => updItem(i, { qtd: num(ev.target.value, 1, 99) })} /></label>
                  )}
                </div>
                {it.desc && <pre className="desc">{it.desc}</pre>}
                <textarea rows="2" placeholder="Anotação do item (opcional)" aria-label={`Anotação de ${it.nome || 'item'}`}
                  value={it.anotacao || ''} onChange={(ev) => updItem(i, { anotacao: ev.target.value })} />
                {grupoMelhorias(it) && (
                  <Melhorias grupo={grupoMelhorias(it)} atuais={it.melhorias || []}
                    onAdd={(n) => addMelhoria(i, n)} onDel={(n) => delMelhoria(i, n)} />
                )}
              </article>
            ))}
            {!f.inventario.length && <p className="vazio">Inventário vazio.</p>}
          </>
        )}

        {aba === 'combate' && (
          <>
            <Colapsavel id="c-acoes" titulo="Ações rápidas" padrao>
              <div className="acoes-rapidas">
                <button className="sec" onClick={iniciativa}><Icon nome="dice" /> Iniciativa</button>
                <button className="sec" onClick={localizar}><Icon nome="alvo" /> Localização</button>
                <button className="sec" onClick={() => mostrar({ ...rolarExpr('1d20'), nome: 'd20' })}><Icon nome="dice" /> d20</button>
              </div>
              <label className="larga">Raio de Distância · <b>{f.raio} – {RAIO[f.raio]}</b>
                <input type="range" min="0" max="10" value={f.raio} onChange={(ev) => set('raio', Number(ev.target.value))} />
              </label>
            </Colapsavel>

            <Colapsavel id="c-dano" titulo="Rolar dano" padrao>
              <div className="campos mini">
                <label>Dano
                  <input value={danoExpr} onChange={(ev) => { setDanoExpr(ev.target.value); setDanoErro(false); }} placeholder="ex: 2d6" aria-invalid={danoErro} />
                </label>
                <label>Resultado
                  <select value={danoRes} onChange={(ev) => setDanoRes(ev.target.value)}>
                    {['Normal', 'Bom', 'Extremo', 'Crítico'].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
                <label title="Queima-roupa, ataque furtivo, Mira Telescópica etc. (+1 dado cada)">Dados extras
                  <Stepper valor={danoExtra} max={10} onChange={setDanoExtra} />
                </label>
              </div>
              <div className="acoes-rapidas">
                <button className="sec" onClick={() => setDanoExpr((x) => `${x.trim()} + ${dadoForca(e.FOR)}`.replace(/^\s*\+\s*/, ''))}>+ Força ({dadoForca(e.FOR)})</button>
                <button onClick={rolarDanoAtaque}><Icon nome="dice" /> Rolar dano</button>
              </div>
              {danoErro && <p className="alerta">Expressão inválida. Use algo como 2d6 + 1d3.</p>}
            </Colapsavel>

            <Colapsavel id="c-pv" titulo="Dano e cura" sub={`PV ${f.pv.atual}/${pvMax}`}>
              {f.pv.morto ? (
                <div className="estado-morte-acoes" role="status">
                  <p className="estado-morto">PERSONAGEM MORTO — a ficha permanece registrada.</p>
                  <button className="sec" onClick={reverterMorte}>Reverter morte</button>
                </div>
              ) : f.pv.atual <= 0 ? (
                <>
                  <p className="estado-morrendo" role="status">ESTADO DE MORRENDO</p>
                  <p className="nota">Se falhar no teste de Vigor, registre a morte abaixo. A Rodada de Imunidade não substitui esse teste.</p>
                  <button className="sec" onClick={() => {
                    setF((o) => ({ ...o, pv: {
                      ...o.pv,
                      morto: true,
                      vidaAntesMorte: o.pv.atual,
                    } }));
                    setAvisoLesao('Morte registrada após falha no teste de Vigor.');
                  }}>Registrar morte (falha no teste de Vigor)</button>
                </>
              ) : null}
              <div className="linha">
                <Stepper valor={danoPv} max={999} onChange={setDanoPv} />
                <button onClick={aplicarDano} disabled={f.pv.morto}>Dano</button>
                <button className="sec" onClick={aplicarCura} disabled={f.pv.morto}>Cura</button>
              </div>
              {f.pv.lesaoGrave && (
                <div className="linha lesao-grave">
                  <span>Lesão grave ativa</span>
                  <button className="sec" disabled={f.pv.atual <= 0 || f.pv.morto} onClick={() => {
                    setIn('pv', 'lesaoGrave', false);
                    setAvisoLesao(null);
                  }}>Marcar como tratada</button>
                </div>
              )}
              {avisoLesao && <p className="alerta" style={{ whiteSpace: 'pre-line' }}>{avisoLesao}</p>}
            </Colapsavel>

            <Colapsavel id="c-status" titulo="Status e condições">
              <div className="status">
                {STATUS.map((s) => (
                  <div key={s.attr} className={`st ${f.status[s.attr] || ''}`}>
                    <span>{s.attr}</span>
                    <select value={f.status[s.attr] || ''} onChange={(ev) => setIn('status', s.attr, ev.target.value)}>
                      <option value="">—</option>
                      <option value="bom">{s.bom} ▲</option>
                      <option value="ruim">{s.ruim} ▼</option>
                    </select>
                  </div>
                ))}
              </div>
              <div className="conds">
                {CONDICOES.map((c) => (
                  <button key={c} title={CONDICOES_DESC[c]} className={`cond ${f.condicoes.includes(c) ? 'ativa' : ''}`} onClick={() => toggleCond(c)}>{c}</button>
                ))}
              </div>
            </Colapsavel>

            <Disputa />

            <Colapsavel id="c-notas" titulo="Anotações de combate">
              <textarea rows="5" placeholder="Armas, ataques, táticas…" value={f.combate} onChange={(ev) => set('combate', ev.target.value)} />
            </Colapsavel>

            <Colapsavel id="c-livres" titulo="Dados livres e histórico">
              <div className="linha">
                <input value={expr} onChange={(ev) => { setExpr(ev.target.value); setExprErro(false); }} placeholder="ex: 2d6 + 1d12 + 3"
                  onKeyDown={(ev) => ev.key === 'Enter' && rolarLivre()} aria-invalid={exprErro} />
                <button onClick={rolarLivre}>Rolar</button>
              </div>
              {exprErro && <p className="alerta">Expressão inválida. Use algo como 2d6 + 1d12 - 2.</p>}
              <ul className="hist">
                {hist.map((h, i) => (
                  <li key={i}>
                    <div className="h-info"><span>{h.nome}</span><small>{detalheRolagem(h)}</small></div>
                    <b>{h.total}</b>{h.resultado && <em className={`res-${h.resultado}`}>{h.resultado}</em>}
                  </li>
                ))}
                {!hist.length && <li className="vazio">Sem rolagens ainda.</li>}
              </ul>
            </Colapsavel>
          </>
        )}

        {aba === 'regras' && <Regras />}

        {aba === 'notas' && (
          <Card titulo="Anotações">
            <textarea className="notas" rows="16" value={f.anotacoes} onChange={(ev) => set('anotacoes', ev.target.value)} />
          </Card>
        )}
      </main>
    </div>
  );
}

const VALOR_RES = { Crítico: 6, Extremo: 5, Bom: 4, Normal: 3, Falha: 2, Desastre: 1 };

// Disputa entre dois resultados e média grupal (valores da tabela do livro)
function Disputa() {
  const [a, setA] = useState('Normal');
  const [b, setB] = useState('Normal');
  const [cont, setCont] = useState(() => Object.fromEntries(Object.keys(VALOR_RES).map((k) => [k, 0])));
  const ia = ORDEM_RESULTADO.indexOf(a);
  const ib = ORDEM_RESULTADO.indexOf(b);
  const veredito = ia > ib ? 'Você vence a disputa.' : ia < ib ? 'O oponente vence a disputa.' : 'Empate: re-rolem os dados até alguém obter um sucesso maior.';
  const n = Object.values(cont).reduce((s, q) => s + q, 0);
  const soma = Object.entries(cont).reduce((s, [k, q]) => s + VALOR_RES[k] * q, 0);
  const media = n ? soma / n : 0;
  const nomeMedia = n ? Object.entries(VALOR_RES).find(([, v]) => v === Math.round(media))[0] : '—';
  const opcoes = ORDEM_RESULTADO.map((r) => <option key={r} value={r}>{r}</option>);
  return (
    <Colapsavel id="c-disputa" titulo="Disputa e média grupal">
      <div className="campos mini">
        <label>Seu resultado<select value={a} onChange={(ev) => setA(ev.target.value)}>{opcoes}</select></label>
        <label>Oponente<select value={b} onChange={(ev) => setB(ev.target.value)}>{opcoes}</select></label>
      </div>
      <p className="nota"><b>{veredito}</b></p>
      <div className="campos mini">
        {Object.keys(VALOR_RES).map((k) => (
          <label key={k}>{k} ({VALOR_RES[k]})
            <Stepper valor={cont[k]} max={50} onChange={(v) => setCont((o) => ({ ...o, [k]: v }))} />
          </label>
        ))}
      </div>
      <p className="nota" title="Número com vírgula é arredondado; em empate entre grupos vale a média de maior valor; persistindo, re-rolem."><b>Média grupal: {n ? `${media.toFixed(2)} → ${nomeMedia}` : '—'}</b>{n ? ` (soma ${soma} ÷ ${n})` : ''}</p>
    </Colapsavel>
  );
}

// Aba Regras: textos do livro com busca
function Regras() {
  const [q, setQ] = useState('');
  const t = q.trim().toLowerCase();
  const secoes = useMemo(() => {
    const por = Object.fromEntries(REGRAS.map((s) => [s.id, s]));
    return [
      por.intro,
      { id: 'pericias', titulo: 'Descrição das perícias', blocos: Object.entries(DESC_PERICIAS) },
      por.tracos,
      { id: 'tracos-desc', titulo: 'Descrição dos Traços', blocos: TRACOS.map((tr) => [tr.nome, DESC_TRACOS[tr.key]]) },
      { id: 'guia', titulo: 'Guia rápido de mecânicas', blocos: GUIA_RAPIDO },
      por.mecanicas, por.combate, por.fuga, por.lesao, por.status,
      {
        id: 'sanidade',
        titulo: 'Condições de sanidade',
        blocos: [
          ...CONDICOES_SANIDADE.map((c) => [`Nível ${c.nivel} · ${c.nome} (abaixo de ${c.abaixo}%)`, c.texto]),
          ...LACUNAS.map((x, i) => [`Lacuna de Memória ${i + 1} (1d3)`, x]),
          ...MANIAS.map((m, i) => [`Mania Inabitual ${i + 1} (1d10)`, `${m.frase}\n\n${m.efeito}`]),
        ],
      },
      por.equip,
    ];
  }, []);
  return (
    <>
      <Card titulo="Regras" sub="Texto do livro v1.2">
        <input className="busca" type="search" placeholder="Buscar nas regras…" value={q} onChange={(ev) => setQ(ev.target.value)} />
      </Card>
      {secoes.map((s) => {
        const blocos = s.blocos.filter(([titulo, texto]) => !t || titulo.toLowerCase().includes(t) || texto.toLowerCase().includes(t));
        if (!blocos.length) return null;
        return (
          <details className="regra card-s" key={s.id} open={!!t}>
            <summary>{s.titulo}</summary>
            {blocos.map(([titulo, texto]) => (
              <div className="bloco" key={titulo}>
                <b>{titulo}</b>
                <p>{texto}</p>
              </div>
            ))}
          </details>
        );
      })}
      {!secoes.some((s) => s.blocos.some(([a, b]) => a.toLowerCase().includes(t) || b.toLowerCase().includes(t))) && <p className="vazio">Nada encontrado.</p>}
    </>
  );
}

function MonoAdd({ onAdd }) {
  const [traco, setTraco] = useState('PER');
  const [nome, setNome] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [indiceSugestao, setIndiceSugestao] = useState(0);
  const sugestoes = MONOMANIAS_DETALHE[traco].filter((m) =>
    m.nome.toLowerCase().includes(nome.trim().toLowerCase()));
  const add = () => {
    const n = nome.trim();
    if (!n) return;
    const achada = MONOMANIAS_DETALHE[traco].find((m) => m.nome.toLowerCase() === n.toLowerCase());
    onAdd(traco, achada ? achada.nome : n, achada ? achada.desc : '');
    setNome('');
    setSugestoesAbertas(false);
  };
  const escolher = (n) => {
    setNome(n);
    setSugestoesAbertas(false);
  };
  return (
    <div className="add-linha">
      <div className="tracos">
        {TRACOS.map((t) => (
          <button key={t.key} className={traco === t.key ? 'ativa' : ''} style={{ '--cor': COR_TRACO[t.key] }}
            onClick={() => { setTraco(t.key); setNome(''); setIndiceSugestao(0); setSugestoesAbertas(false); }}>{t.nome}</button>
        ))}
      </div>
      <p className="nota" style={{ borderColor: COR_TRACO[traco] }}>{DESC_TRACOS[traco]}</p>
      <div className="linha">
        <div className="mono-select">
          <input role="combobox" aria-autocomplete="list" aria-expanded={sugestoesAbertas}
            aria-controls="monomanias-opcoes"
            aria-activedescendant={sugestoesAbertas && sugestoes[indiceSugestao]
              ? `monomania-${traco}-${MONOMANIAS_DETALHE[traco].indexOf(sugestoes[indiceSugestao])}` : undefined}
            placeholder="Escolha ou digite" value={nome}
            onFocus={() => setSugestoesAbertas(true)}
            onBlur={() => setSugestoesAbertas(false)}
            onChange={(ev) => { setNome(ev.target.value); setIndiceSugestao(0); setSugestoesAbertas(true); }}
            onKeyDown={(ev) => {
              if (ev.key === 'Escape') setSugestoesAbertas(false);
              if (ev.key === 'ArrowDown' && sugestoes.length) {
                ev.preventDefault();
                setSugestoesAbertas(true);
                setIndiceSugestao((i) => (i + 1) % sugestoes.length);
              }
              if (ev.key === 'ArrowUp' && sugestoes.length) {
                ev.preventDefault();
                setSugestoesAbertas(true);
                setIndiceSugestao((i) => (i - 1 + sugestoes.length) % sugestoes.length);
              }
              if (ev.key === 'Enter' && sugestoesAbertas && sugestoes[indiceSugestao]) {
                ev.preventDefault();
                escolher(sugestoes[indiceSugestao].nome);
              }
            }} />
          {sugestoesAbertas && (
            <div id="monomanias-opcoes" className="mono-opcoes" role="listbox">
              {sugestoes.map((m) => (
                <button type="button" role="option" id={`monomania-${traco}-${MONOMANIAS_DETALHE[traco].indexOf(m)}`}
                  aria-selected={indiceSugestao === sugestoes.indexOf(m)} tabIndex={-1} key={m.nome}
                  onMouseDown={(ev) => ev.preventDefault()} onClick={() => escolher(m.nome)}>{m.nome}</button>
              ))}
              {!sugestoes.length && <span className="mono-sem-opcoes">Nenhuma sugestão encontrada.</span>}
            </div>
          )}
        </div>
        <button onClick={add}>+ Adicionar</button>
      </div>
    </div>
  );
}

function EquipAdd({ onAdd }) {
  const [nome, setNome] = useState('');
  const add = () => {
    const eq = catalogo(nome);
    if (!eq) return;
    const cap = eq.categoria === 'Armazenamento' ? Number(/(\d+) cargas/.exec(eq.desc)?.[1] || 0) : 0;
    onAdd({ nome: eq.nome, cat: eq.cat, carga: eq.carga || '0', bonus: cap, desc: eq.desc });
    setNome('');
  };
  const lista = EQUIPAMENTOS.filter((x) => !GRUPOS_OCULTOS.includes(x.categoria));
  const grupos = [...new Set(lista.map((x) => x.categoria))];
  return (
    <div className="linha">
      <select value={nome} onChange={(ev) => setNome(ev.target.value)}>
        <option value="">Catálogo de equipamentos…</option>
        {grupos.map((g) => (
          <optgroup key={g} label={g}>
            {lista.filter((x) => x.categoria === g).map((x) => <option key={x.nome} value={x.nome}>{x.nome}</option>)}
          </optgroup>
        ))}
      </select>
      <button onClick={add} disabled={!nome}>+ Do catálogo</button>
    </div>
  );
}

// Melhorias/modificações ficam presas à arma: o botão abre a escolha e a escolhida aparece no item
function Melhorias({ grupo, atuais, onAdd, onDel }) {
  const [aberto, setAberto] = useState(false);
  const [sel, setSel] = useState('');
  const opcoes = EQUIPAMENTOS.filter((x) => x.categoria === grupo && !atuais.includes(x.nome));
  const confirmar = () => {
    if (!sel) return;
    onAdd(sel);
    setSel('');
    setAberto(false);
  };
  return (
    <div className="melhorias">
      {atuais.map((n) => (
        <details key={n} className="melhoria">
          <summary>
            <span>{n}</span>
            <button type="button" className="x" onClick={(ev) => { ev.preventDefault(); onDel(n); }} aria-label={`Remover ${n}`}>✕</button>
          </summary>
          <pre className="desc">{catalogo(n)?.desc}</pre>
        </details>
      ))}
      {aberto ? (
        <div className="linha">
          <select value={sel} onChange={(ev) => setSel(ev.target.value)}>
            <option value="">Escolha…</option>
            {opcoes.map((x) => <option key={x.nome} value={x.nome}>{x.nome}</option>)}
          </select>
          <button onClick={confirmar} disabled={!sel}>Adicionar</button>
          <button className="sec" onClick={() => setAberto(false)}>Cancelar</button>
        </div>
      ) : (
        opcoes.length > 0 && <button className="sec" onClick={() => setAberto(true)}>Melhorias</button>
      )}
    </div>
  );
}
