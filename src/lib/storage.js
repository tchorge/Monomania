// Comunicação com o servidor (login por token, fichas e eventos ao vivo)
const TK = 'monomania:token';
export const clientId = (() => {
  let c = sessionStorage.getItem('monomania:cid');
  if (!c) {
    c = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('monomania:cid', c);
  }
  return c;
})();

export const getToken = () => localStorage.getItem(TK);
export const setToken = (t) => (t ? localStorage.setItem(TK, t) : localStorage.removeItem(TK));

let aoDeslogar = () => {};
export const onDeslogar = (fn) => (aoDeslogar = fn);

async function req(url, opts = {}) {
  const r = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'X-Client': clientId,
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...opts.headers,
    },
  });
  const dados = await r.json().catch(() => ({}));
  if (r.status === 401 && getToken()) aoDeslogar();
  if (!r.ok) throw new Error(dados.error || `Erro ${r.status}`);
  return dados;
}
const post = (url, body) => req(url, { method: 'POST', body: JSON.stringify(body) });

export const estado = () => req('/api/estado');
export const entrar = (usuario, senha) => post('/api/entrar', { usuario, senha });
export const registrar = (usuario, senha, nome) => post('/api/registrar', { usuario, senha, nome });
export const eu = () => req('/api/eu');
export const sair = () => post('/api/sair', {}).catch(() => {});
export const usuarios = () => req('/api/usuarios');
export const redefinirSenha = (u, senha) => post(`/api/usuarios/${u}/senha`, { senha });

export const npcs = () => req('/api/npcs');

export const listar = () => req('/api/fichas');
export const carregar = (id) => req(`/api/fichas/${id}`);
export const excluir = (id) => req(`/api/fichas/${id}`, { method: 'DELETE' });
export async function salvar(ficha) {
  try {
    const r = await req(`/api/fichas/${ficha.id}`, { method: 'PUT', body: JSON.stringify(ficha) });
    return r.updatedAt;
  } catch {
    return null;
  }
}

// Eventos ao vivo: onFicha(ficha), onExcluida(id), onStatus(conectado)
export function assinar({ onFicha, onExcluida, onStatus }) {
  const es = new EventSource(`/api/eventos?token=${getToken()}&c=${clientId}`);
  es.onopen = () => onStatus?.(true);
  es.onerror = () => onStatus?.(false);
  es.addEventListener('ficha', (e) => onFicha(JSON.parse(e.data)));
  es.addEventListener('excluida', (e) => onExcluida(JSON.parse(e.data).id));
  return () => es.close();
}
