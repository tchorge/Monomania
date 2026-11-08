import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ESPECIAIS, PERICIAS, TRACOS, CAPACIDADE, PONTOS_PARTIDA, TABELA_PARTIDA,
  NIVEIS_PRESENCA, STATUS, CONDICOES, RAIO, DESCANSO,
  deslocamento, dadoForca, pvMaximo, nivelPresenca, capacidadeCarga, medoAtual,
} from '../data/rules.js';
import { MONOMANIAS_DETALHE, EQUIPAMENTOS } from '../data/catalogo.js';
import { testePericia, rolarExpr, detalheRolagem } from '../lib/dice.js';
import { salvar } from '../lib/storage.js';
import Icon from './Icon.jsx';

const num = (v, min = 0, max = 999) => Math.min(max, Math.max(min, Number(v) || 0));
const pct = (a, m) => (m > 0 ? Math.min(100, Math.max(0, (a / m) * 100)) : 0);
const COR_TRACO = { PER: '#4cc9f0', AUD: '#ff7a3d', DET: '#ef2b3c', VIR: '#f5d76e', DES: '#a66cff', RAC: '#2ec4b6' };

const ABAS = [
  { id: 'ficha', nome: 'Ficha' },
  { id: 'mono', nome: 'Monomanias' },
  { id: 'inv', nome: 'Inventário' },
  { id: 'combate', nome: 'Combate' },
  { id: 'notas', nome: 'Notas' },
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
      <div className="ln-n"><b>{nome}</b>{sub && <small>{sub}</small>}</div>
      <div className="ln-c">
        <Rb className="rb sm" onClick={() => onChange(num(valor + 1, 1, 18))} aria-label={`Aumentar ${nome}`}>+</Rb>
        <input className="ln-v" type="number" inputMode="numeric" value={valor} aria-label={nome}
          onChange={(e) => onChange(num(e.target.value, 1, 18))} />
        <Rb className="rb sm" onClick={() => onChange(num(valor - 1, 1, 18))} aria-label={`Diminuir ${nome}`}>−</Rb>
      </div>
      <button className="dado" onClick={onRolar} aria-label={`Rolar ${nome}`}><img src="/img/dado.png" alt="" /></button>
    </div>
  );
}

function Vit({ rotulo, valor, max, aviso, onMais, onMenos, extra }) {
  return (
    <div className={`vit ${extra ? 'com-extra' : ''}`}>
      <div className="vit-r">{rotulo}{aviso && <span className="vit-a">{aviso}</span>}</div>
      <div className="vit-v">{valor}{max != null && <small>/{max}</small>}</div>
      <div className="par">
        <Rb onClick={onMais} aria-label={`Aumentar ${rotulo}`}>+</Rb>
        <Rb onClick={onMenos} aria-label={`Diminuir ${rotulo}`}>−</Rb>
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
              <span className="d">d20 · {r.d20}</span>
              {r.extras.map((e, i) => <span className="d" key={i}>d6 · {e}</span>)}
            </div>
            <div className="total">{r.total}</div>
            <div className={`res res-${r.resultado}`}>{r.resultado}</div>
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

export default function Sheet({ inicial, remota, mestre, conectado, onVoltar }) {
  const [f, setF] = useState(inicial);
  const [estado, setEstado] = useState('salvo');
  const [aba, setAba] = useState('ficha');
  const [res, setRes] = useState(null);
  const [hist, setHist] = useState([]);
  const [pulsoesUso, setPulsoesUso] = useState(0);
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
  const cargaUsada = f.inventario.reduce((s, i) => s + num(i.carga), 0);
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
      ordem === 'valor' ? f.pericias[c] - f.pericias[a] || a.localeCompare(c) : a.localeCompare(c));
  }, [busca, ordem, f.pericias]);

  const mostrar = (r) => {
    setRes(r);
    setHist((h) => [r, ...h].slice(0, 20));
    if (audio.current) {
      audio.current.currentTime = 0;
      audio.current.play().catch(() => {});
    }
  };
  const testar = (nome, valor) => {
    const gastar = Math.min(pulsoesUso, Math.max(0, f.pulsoes.atual));
    if (gastar) setIn('pulsoes', 'atual', f.pulsoes.atual - gastar);
    mostrar(testePericia(nome, valor, gastar));
    setPulsoesUso(0);
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

  const pvAlerta = f.pv.atual <= 0 ? 'Morrendo' : f.pv.atual <= 3 ? 'Risco de desmaio' : null;
  const mudaPV = (d) => setF((o) => ({ ...o, pv: { ...o.pv, atual: Math.min(pvMax, o.pv.atual + d) } }));
  const mudaPS = (d) => setF((o) => ({ ...o, ps: { ...o.ps, atual: num(o.ps.atual + d, 0, 100) } }));
  const mudaPU = (d) => setF((o) => ({ ...o, pulsoes: { ...o.pulsoes, atual: Math.max(0, o.pulsoes.atual + d) } }));
  const mudaPP = (d) => setF((o) => {
    const v = o.pp.atual + d;
    return { ...o, pp: { ...o.pp, atual: Math.max(0, o.pp.max ? Math.min(o.pp.max, v) : v) } };
  });
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
                <Vit rotulo="PV" valor={f.pv.atual} max={pvMax} aviso={pvAlerta} onMais={() => mudaPV(1)} onMenos={() => mudaPV(-1)} />
                <Vit rotulo="PS" valor={`${f.ps.atual}%`} aviso={medo && `Medo ${medo.nivel}`} onMais={() => mudaPS(1)} onMenos={() => mudaPS(-1)} />
                <Vit rotulo="PU" valor={f.pulsoes.atual} onMais={() => mudaPU(1)} onMenos={() => mudaPU(-1)} />
                <Vit rotulo="PP" valor={f.pp.atual} max={f.pp.max || null} onMais={() => mudaPP(1)} onMenos={() => mudaPP(-1)} />
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
              {medo && <p className="alerta">Potencial de Medo Nv {medo.nivel}: {medo.nome}</p>}
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
            <Card titulo="Carga" sub={`${cargaUsada} / ${capTotal} · só corpo: ${capCorpo} · limite absoluto ${capLimite}`}>
              <div className={`barra grande ${cargaUsada > capTotal ? 'over' : ''}`}><i style={{ width: `${pct(cargaUsada, capTotal)}%` }} /></div>
              {cargaUsada > capTotal && <p className="alerta">{cargaUsada > capLimite ? 'Acima do limite absoluto (o dobro da capacidade)!' : 'Sobrecarregado: penalidades.'}</p>}
              {cargaUsada > capCorpo && bonusCarga === 0 && <p className="alerta">Acima do que cabe no corpo e bolsos ({capCorpo}). Adicione mochila, pochete ou similar.</p>}
              <EquipAdd onAdd={(it) => set('inventario', [...f.inventario, it])} />
              <button className="sec" onClick={() => set('inventario', [...f.inventario, { nome: '', cat: '', carga: '' }])}>+ Item em branco</button>
            </Card>
            {f.inventario.map((it, i) => (
              <article className="item-card" key={i}>
                <div className="item">
                  <input className="it-nome" placeholder="Nome do item" value={it.nome} onChange={(ev) => updItem(i, { nome: ev.target.value })} />
                  <button className="x" onClick={() => set('inventario', f.inventario.filter((_, j) => j !== i))} aria-label="Remover">✕</button>
                </div>
                <div className="campos mini">
                  <label>Categoria<input type="number" inputMode="numeric" value={it.cat} onChange={(ev) => updItem(i, { cat: ev.target.value })} /></label>
                  <label>Carga<input type="number" inputMode="numeric" value={it.carga} onChange={(ev) => updItem(i, { carga: ev.target.value })} /></label>
                </div>
                {it.desc && <pre className="desc">{it.desc}</pre>}
              </article>
            ))}
            {!f.inventario.length && <p className="vazio">Inventário vazio.</p>}
          </>
        )}

        {aba === 'combate' && (
          <>
            <Card titulo="Ações rápidas">
              <div className="acoes-rapidas">
                <button className="sec" onClick={() => testar('Iniciativa (Preparação)', f.pericias['Preparação'])}><Icon nome="dice" /> Iniciativa</button>
                <button className="sec" onClick={() => mostrar({ ...rolarExpr('1d10'), nome: 'Localização (d10)' })}><Icon nome="alvo" /> Localização d10</button>
                <button className="sec" onClick={() => mostrar({ ...rolarExpr('1d20'), nome: 'd20' })}><Icon nome="dice" /> d20</button>
              </div>
              <label className="larga">Raio de Distância · <b>{f.raio} – {RAIO[f.raio]}</b>
                <input type="range" min="0" max="10" value={f.raio} onChange={(ev) => set('raio', Number(ev.target.value))} />
              </label>
            </Card>

            <Card titulo="Status" sub="vantagem / desvantagem">
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
                  <button key={c} className={`cond ${f.condicoes.includes(c) ? 'ativa' : ''}`} onClick={() => toggleCond(c)}>{c}</button>
                ))}
              </div>
            </Card>

            <Card titulo="Anotações de combate">
              <textarea rows="5" placeholder="Armas, ataques, táticas…" value={f.combate} onChange={(ev) => set('combate', ev.target.value)} />
            </Card>

            <Card titulo="Dados livres">
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
            </Card>
          </>
        )}

        {aba === 'notas' && (
          <Card titulo="Anotações">
            <textarea className="notas" rows="16" value={f.anotacoes} onChange={(ev) => set('anotacoes', ev.target.value)} />
          </Card>
        )}
      </main>
    </div>
  );
}

function MonoAdd({ onAdd }) {
  const [traco, setTraco] = useState('PER');
  const [nome, setNome] = useState('');
  const add = () => {
    const n = nome.trim();
    if (!n) return;
    const achada = MONOMANIAS_DETALHE[traco].find((m) => m.nome.toLowerCase() === n.toLowerCase());
    onAdd(traco, achada ? achada.nome : n, achada ? achada.desc : '');
    setNome('');
  };
  return (
    <div className="add-linha">
      <div className="tracos">
        {TRACOS.map((t) => (
          <button key={t.key} className={traco === t.key ? 'ativa' : ''} style={{ '--cor': COR_TRACO[t.key] }}
            onClick={() => { setTraco(t.key); setNome(''); }}>{t.nome}</button>
        ))}
      </div>
      <div className="linha">
        <input list="monos" placeholder="Escolha ou digite" value={nome} onChange={(ev) => setNome(ev.target.value)} />
        <datalist id="monos">{MONOMANIAS_DETALHE[traco].map((m) => <option key={m.nome} value={m.nome} />)}</datalist>
        <button onClick={add}>+ Adicionar</button>
      </div>
    </div>
  );
}

function EquipAdd({ onAdd }) {
  const [nome, setNome] = useState('');
  const add = () => {
    const eq = EQUIPAMENTOS.find((x) => x.nome === nome);
    if (!eq) return;
    const cap = eq.categoria === 'Armazenamento' ? Number(/(\d+) cargas/.exec(eq.desc)?.[1] || 0) : 0;
    onAdd({ nome: eq.nome, cat: eq.cat, carga: eq.carga || '0', bonus: cap, desc: eq.desc });
    setNome('');
  };
  const grupos = [...new Set(EQUIPAMENTOS.map((x) => x.categoria))];
  return (
    <div className="linha">
      <select value={nome} onChange={(ev) => setNome(ev.target.value)}>
        <option value="">Catálogo de equipamentos…</option>
        {grupos.map((g) => (
          <optgroup key={g} label={g}>
            {EQUIPAMENTOS.filter((x) => x.categoria === g).map((x) => <option key={x.nome} value={x.nome}>{x.nome}</option>)}
          </optgroup>
        ))}
      </select>
      <button onClick={add} disabled={!nome}>+ Do catálogo</button>
    </div>
  );
}
