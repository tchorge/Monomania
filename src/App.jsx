import { useEffect, useMemo, useRef, useState } from 'react';
import * as api from './lib/storage.js';
import { novaFicha, pvMaximo, PONTOS_PARTIDA } from './data/rules.js';
import { MONOMANIAS_DETALHE } from './data/catalogo.js';
import Sheet from './components/Sheet.jsx';

// Gerador de NPC genérico (p.84–89): só o mestre vê; os dados vêm de /api/npcs, que o servidor restringe ao mestre
function NpcGerador({ onCriar }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [arq, setArq] = useState('civil');
  const [nivel, setNivel] = useState(0);
  const [pers, setPers] = useState('aleatoria');
  const [nome, setNome] = useState('');

  useEffect(() => { api.npcs().then(setDados).catch((e) => setErro(e.message)); }, []);
  if (erro) return <p className="alerta">{erro}</p>;
  if (!dados) return null;

  const criar = () => {
    const a = dados.arquetipos.find((x) => x.id === arq);
    const n = a.niveis[nivel];
    const lista = dados.personalidades;
    const p = pers === 'nenhuma' ? null : lista.find((x) => String(x.id) === pers) || lista[Math.floor(Math.random() * lista.length)];
    const f = novaFicha();
    f.nome = nome.trim() || `${a.nome} ${n.nome}`;
    f.especiais = { ...n.especiais };
    f.pericias = { ...n.pericias };
    f.pontoPartida = nivel;
    f.pv = { atual: n.vida, extra: Math.max(0, n.vida - pvMaximo(n.especiais.VIG)), nota: '' };
    f.aparencia = `NPC genérico: ${a.nome} (${n.nome})${p ? ` · Personalidade: ${p.nome}` : ''}`;
    f.monomanias = (p ? p.monomanias : []).flatMap((m) => {
      for (const traco of Object.keys(MONOMANIAS_DETALHE)) {
        const achada = MONOMANIAS_DETALHE[traco].find((x) => x.nome === m);
        if (achada) return [{ traco, nome: achada.nome, desc: achada.desc }];
      }
      return [];
    });
    onCriar(f);
    setNome('');
  };

  return (
    <section className="card-s npc-ger">
      <h2>Gerar NPC genérico</h2>
      <div className="campos">
        <label>Arquétipo
          <select value={arq} onChange={(e) => setArq(e.target.value)}>
            {dados.arquetipos.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
        </label>
        <label>Ponto de Partida
          <select value={nivel} onChange={(e) => setNivel(Number(e.target.value))}>
            {PONTOS_PARTIDA.map((p, i) => <option key={p} value={i}>{p}</option>)}
          </select>
        </label>
        <label>Personalidade
          <select value={pers} onChange={(e) => setPers(e.target.value)}>
            <option value="aleatoria">Aleatória (1d6)</option>
            <option value="nenhuma">Sem monomanias</option>
            {dados.personalidades.map((p) => <option key={p.id} value={p.id}>{p.id}. {p.nome}</option>)}
          </select>
        </label>
        <label>Nome (opcional)<input value={nome} onChange={(e) => setNome(e.target.value)} /></label>
      </div>
      <button onClick={criar}>+ Criar NPC</button>
    </section>
  );
}

function Login({ onLogin }) {
  const [semUsuarios, setSemUsuarios] = useState(false);
  const [modo, setModo] = useState('entrar');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.estado().then((e) => {
      setSemUsuarios(e.semUsuarios);
      if (e.semUsuarios) setModo('registrar');
    }).catch(() => setErro('Não foi possível falar com o servidor.'));
  }, []);

  const enviar = async (ev) => {
    ev.preventDefault();
    setBusy(true);
    setErro('');
    try {
      const r = modo === 'entrar' ? await api.entrar(usuario, senha) : await api.registrar(usuario, senha, nome);
      api.setToken(r.token);
      onLogin({ usuario: r.usuario, nome: r.nome, papel: r.papel });
    } catch (e) {
      setErro(e.message);
    }
    setBusy(false);
  };

  return (
    <form className="home login" onSubmit={enviar}>
      <img src="/img/dado2.png" alt="" className="logo" />
      <h1>MONOMANIA</h1>
      <p className="sub">{modo === 'entrar' ? 'Entrar' : semUsuarios ? 'Criar conta do Mestre' : 'Criar conta de Jogador'}</p>
      {semUsuarios && <p className="aviso">Esta é a primeira conta: ela será o <b>Mestre</b> da mesa.</p>}
      {modo === 'registrar' && (
        <label>Nome de exibição<input value={nome} onChange={(e) => setNome(e.target.value)} /></label>
      )}
      <label>Usuário<input value={usuario} autoCapitalize="none" autoComplete="username" onChange={(e) => setUsuario(e.target.value)} /></label>
      <label>Senha<input type="password" value={senha} autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'} onChange={(e) => setSenha(e.target.value)} /></label>
      {erro && <p className="alerta">{erro}</p>}
      <button disabled={busy}>{modo === 'entrar' ? 'Entrar' : 'Criar conta'}</button>
      {!semUsuarios && (
        <button type="button" className="sec" onClick={() => { setModo(modo === 'entrar' ? 'registrar' : 'entrar'); setErro(''); }}>
          {modo === 'entrar' ? 'Criar conta' : 'Já tenho conta'}
        </button>
      )}
    </form>
  );
}

const Mini = ({ f }) => {
  const max = pvMaximo(f.especiais?.VIG || 1) + (Number(f.pv?.extra) || 0);
  const pv = f.pv?.atual ?? 0;
  const ps = f.ps?.atual ?? 0;
  return (
    <>
      {f.pv?.morto && <strong className="estado-morto">MORTO</strong>}
      {!f.pv?.morto && pv <= 0 && <strong className="estado-morrendo">MORRENDO</strong>}
      <div className="mini-bar"><i style={{ width: `${Math.max(0, Math.min(100, (pv / max) * 100))}%`, background: '#b3202a' }} /><span>PV {pv}/{max}</span></div>
      <div className="mini-bar"><i style={{ width: `${Math.max(0, Math.min(100, ps))}%`, background: '#3b6fb3' }} /><span>PS {ps}%</span></div>
      <small>Pulsões: {f.pulsoes?.atual ?? 0}{f.condicoes?.length ? ` · ${f.condicoes.join(', ')}` : ''}</small>
    </>
  );
};

function Cards({ lista, onAbrir, onApagar, vazio }) {
  if (!lista.length) return <p className="vazio">{vazio}</p>;
  return (
    <div className="cards grade">
      {lista.map((f) => (
        <div className="card" key={f.id}>
          <button className="card-main" onClick={() => onAbrir(f.id)}>
            <div className="card-topo">
              <img src={f.foto || '/img/character3.png'} alt="" />
              <div>
                <strong>{f.nome || 'Sem nome'}</strong>
                <span>{[f.donoNome, f.campanha].filter(Boolean).join(' · ') || '—'}</span>
              </div>
            </div>
            <Mini f={f} />
          </button>
          {onApagar && <button className="x" title="Excluir" onClick={() => onApagar(f)}>✕</button>}
        </div>
      ))}
    </div>
  );
}

function Jogadores({ user, onUsuarioAtualizado }) {
  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);
  const carregar = () => api.usuarios().then(setLista).catch((e) => setErro(e.message));
  useEffect(() => { carregar(); }, []);

  const editar = (u) => {
    setEditando(u.usuario);
    setUsuario(u.usuario);
    setSenha('');
    setErro('');
  };
  const salvar = async (ev) => {
    ev.preventDefault();
    setBusy(true);
    setErro('');
    try {
      const atualizado = await api.atualizarUsuario(editando, { usuario, senha });
      if (editando === user.usuario) onUsuarioAtualizado(atualizado);
      setEditando('');
      setSenha('');
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="cards">
      {erro && !editando && <p className="alerta">{erro}</p>}
      {lista.map((u) => (
        <article className="card conta-card" key={u.usuario}>
          <div className="conta-info"><strong>{u.nome}</strong><span>{u.usuario} · {u.papel}</span></div>
          {editando === u.usuario ? (
            <form className="conta-edicao" onSubmit={salvar}>
              <div className="campos">
                <label>Usuário<input value={usuario} autoCapitalize="none" autoComplete="username" onChange={(e) => setUsuario(e.target.value)} /></label>
                <label>Nova senha (opcional)<input type="password" autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Deixe vazio para manter" /></label>
              </div>
              {erro && <p className="alerta">{erro}</p>}
              <div className="linha">
                <button disabled={busy}>{busy ? 'Salvando…' : 'Salvar alterações'}</button>
                <button type="button" className="sec" onClick={() => { setEditando(''); setErro(''); }}>Cancelar</button>
              </div>
            </form>
          ) : (
            <button className="sec" onClick={() => editar(u)}>Editar usuário e senha</button>
          )}
        </article>
      ))}
    </div>
  );
}

function Home({ user, fichas, conectado, onAbrir, onSair, recarregar, onUsuarioAtualizado }) {
  const [aba, setAba] = useState('mesa');
  const fileRef = useRef();
  const mestre = user.papel === 'mestre';
  const minhas = fichas.filter((f) => f.owner === user.usuario);
  const mesa = fichas.filter((f) => f.owner !== user.usuario);

  const criar = async () => {
    const f = novaFicha();
    await api.salvar(f);
    onAbrir(f.id, { ...f, owner: user.usuario });
  };
  const criarNpc = async (f) => {
    await api.salvar(f);
    onAbrir(f.id, { ...f, owner: user.usuario });
  };
  const apagar = async (f) => {
    if (!confirm(`Excluir a ficha de ${f.nome || 'sem nome'}?`)) return;
    await api.excluir(f.id);
    recarregar();
  };
  const importar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const f = JSON.parse(await file.text());
      await api.salvar({ ...novaFicha(), ...f, id: novaFicha().id });
      recarregar();
    } catch {
      alert('Arquivo inválido.');
    }
    e.target.value = '';
  };

  return (
    <div className="home home-larga">
      <header className="topo">
        <div>
          <strong>{user.nome}</strong> <small>({mestre ? 'Mestre' : 'Jogador'})</small>
          <span className={`ponto ${conectado ? 'on' : 'off'}`} title={conectado ? 'Ao vivo' : 'Reconectando…'} />
        </div>
        <button className="sec" onClick={onSair}>Sair</button>
      </header>
      <img src="/img/dado2.png" alt="" className="logo" />
      <h1>MONOMANIA</h1>

      {mestre && (
        <div className="abas">
          <button className={aba === 'mesa' ? 'ativa' : ''} onClick={() => setAba('mesa')}>Mesa ({mesa.length})</button>
          <button className={aba === 'minhas' ? 'ativa' : ''} onClick={() => setAba('minhas')}>NPCs / Minhas ({minhas.length})</button>
          <button className={aba === 'jogadores' ? 'ativa' : ''} onClick={() => setAba('jogadores')}>Contas</button>
        </div>
      )}

      {mestre && aba === 'mesa' && (
        <>
          <p className="sub">Fichas dos jogadores, ao vivo. Toque em uma para abrir e editar.</p>
          <Cards lista={mesa} onAbrir={onAbrir} onApagar={apagar} vazio="Nenhum jogador criou ficha ainda." />
        </>
      )}
      {mestre && aba === 'jogadores' && <Jogadores user={user} onUsuarioAtualizado={onUsuarioAtualizado} />}
      {(!mestre || aba === 'minhas') && (
        <>
          {mestre && <NpcGerador onCriar={criarNpc} />}
          <div className="acoes">
            <button onClick={criar}>+ Nova ficha</button>
            <button className="sec" onClick={() => fileRef.current.click()}>Importar JSON</button>
            <input ref={fileRef} type="file" accept="application/json" hidden onChange={importar} />
          </div>
          <Cards lista={minhas} onAbrir={onAbrir} onApagar={apagar} vazio="Nenhuma ficha ainda." />
        </>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = carregando, null = deslogado
  const [fichas, setFichas] = useState([]);
  const [aberta, setAberta] = useState(null);
  const [conectado, setConectado] = useState(false);

  const logout = () => {
    api.setToken(null);
    setUser(null);
    setAberta(null);
    setFichas([]);
  };

  useEffect(() => {
    api.onDeslogar(logout);
    if (!api.getToken()) return setUser(null);
    api.eu().then(setUser).catch(() => setUser(null));
  }, []);

  const recarregar = () => api.listar().then(setFichas).catch(() => {});

  useEffect(() => {
    if (!user) return;
    recarregar();
    const parar = api.assinar({
      onStatus: (ok) => {
        setConectado(ok);
        if (ok) recarregar();
      },
      onFicha: (f) => setFichas((l) => (l.some((x) => x.id === f.id) ? l.map((x) => (x.id === f.id ? f : x)) : [f, ...l])),
      onExcluida: (id) => setFichas((l) => l.filter((x) => x.id !== id)),
    });
    return parar;
  }, [user]);

  const ordenadas = useMemo(() => [...fichas].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)), [fichas]);

  if (user === undefined) return null;
  if (!user) return <Login onLogin={setUser} />;

  if (aberta) {
    const atual = fichas.find((f) => f.id === aberta.id);
    return (
      <Sheet
        key={aberta.id}
        inicial={aberta}
        remota={atual}
        mestre={user.papel === 'mestre'}
        conectado={conectado}
        onVoltar={() => {
          setAberta(null);
          recarregar();
        }}
      />
    );
  }

  return (
    <Home
      user={user}
      fichas={ordenadas}
      conectado={conectado}
      recarregar={recarregar}
      onUsuarioAtualizado={setUser}
      onAbrir={async (id, f) => setAberta(f || (await api.carregar(id)))}
      onSair={async () => {
        await api.sair();
        logout();
      }}
    />
  );
}
