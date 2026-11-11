// Servidor: serve o build (dist), contas/login, fichas por dono e atualização ao vivo (SSE).
// Dados em data/*.json. O PRIMEIRO usuário cadastrado vira o Mestre.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const F_FICHAS = path.join(DATA_DIR, 'fichas.json');
const F_USERS = path.join(DATA_DIR, 'usuarios.json');
const F_SESS = path.join(DATA_DIR, 'sessoes.json');
const PORT = process.env.PORT || 3000;
const SESSAO_MS = 30 * 24 * 3600 * 1000;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.json': 'application/json', '.ico': 'image/x-icon',
};

fs.mkdirSync(DATA_DIR, { recursive: true });
const load = (file) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; }
};
const save = (file, obj) => fs.writeFileSync(file, JSON.stringify(obj, null, 2));

const NPCS = load(path.join(__dirname, 'npcs.json'));
let fichas = load(F_FICHAS);
let users = load(F_USERS);
let sessoes = load(F_SESS);

const hashSenha = (senha, salt) => crypto.scryptSync(senha, salt, 32).toString('hex');
const novoHash = (senha) => {
  const salt = crypto.randomBytes(16).toString('hex');
  return { salt, hash: hashSenha(senha, salt) };
};
const confere = (senha, u) => {
  const a = Buffer.from(hashSenha(senha, u.salt), 'hex');
  const b = Buffer.from(u.hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const json = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 10_000_000) { reject(new Error('muito grande')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch (e) { reject(e); }
    });
  });

const ID_OK = /^[\w-]{1,64}$/;
const USER_OK = /^[\p{L}\p{N}_.-]{3,24}$/u;

// limite simples de tentativas de login por IP
const falhas = new Map();
const bloqueado = (ip) => {
  const f = falhas.get(ip);
  return f && f.n >= 10 && Date.now() - f.t < 5 * 60 * 1000;
};
const registraFalha = (ip) => {
  const f = falhas.get(ip);
  falhas.set(ip, { n: f && Date.now() - f.t < 5 * 60 * 1000 ? f.n + 1 : 1, t: Date.now() });
};

function usuarioDoToken(token) {
  const s = sessoes[token];
  if (!s) return null;
  if (s.exp < Date.now()) {
    delete sessoes[token];
    save(F_SESS, sessoes);
    return null;
  }
  const u = users[s.usuario];
  return u ? { usuario: s.usuario, nome: u.nome, papel: u.papel } : null;
}

const criarSessao = (usuario) => {
  const token = crypto.randomBytes(32).toString('hex');
  sessoes[token] = { usuario, exp: Date.now() + SESSAO_MS };
  save(F_SESS, sessoes);
  return token;
};

const ehMestre = (u) => u.papel === 'mestre';
const pode = (u, f) => ehMestre(u) || f.owner === u.usuario;
const comDono = (f) => ({ ...f, donoNome: users[f.owner]?.nome || f.owner || '' });

// ---- SSE ----
const clientes = new Set(); // { res, user, cid }
function emitir(evento, dados, origemCid, ficha) {
  const msg = `event: ${evento}\ndata: ${JSON.stringify(dados)}\n\n`;
  for (const c of clientes) {
    if (c.cid && c.cid === origemCid) continue;
    if (ehMestre(c.user) || (ficha && ficha.owner === c.user.usuario)) c.res.write(msg);
  }
}
setInterval(() => { for (const c of clientes) c.res.write(': ping\n\n'); }, 25000);

async function api(req, res, url) {
  const ip = req.socket.remoteAddress;
  try {
    const rota = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    const [recurso, id, sub] = rota;
    const m = req.method;

    if (recurso === 'estado' && m === 'GET') return json(res, 200, { semUsuarios: Object.keys(users).length === 0 });

    if ((recurso === 'registrar' || recurso === 'entrar') && m === 'POST') {
      if (bloqueado(ip)) return json(res, 429, { error: 'Muitas tentativas. Aguarde alguns minutos.' });
      const { usuario = '', senha = '', nome = '' } = await readBody(req);
      const chave = String(usuario).trim().toLowerCase();
      if (recurso === 'registrar') {
        if (!USER_OK.test(chave)) return json(res, 400, { error: 'Usuário: 3 a 24 letras, números, _ . -' });
        if (String(senha).length < 4) return json(res, 400, { error: 'Senha com pelo menos 4 caracteres.' });
        if (users[chave]) return json(res, 409, { error: 'Usuário já existe.' });
        const papel = Object.keys(users).length === 0 ? 'mestre' : 'jogador';
        users[chave] = { nome: String(nome).trim().slice(0, 40) || String(usuario).trim(), papel, ...novoHash(String(senha)) };
        save(F_USERS, users);
        return json(res, 200, { token: criarSessao(chave), usuario: chave, nome: users[chave].nome, papel });
      }
      const u = users[chave];
      if (!u || !confere(String(senha), u)) {
        registraFalha(ip);
        return json(res, 401, { error: 'Usuário ou senha incorretos.' });
      }
      falhas.delete(ip);
      return json(res, 200, { token: criarSessao(chave), usuario: chave, nome: u.nome, papel: u.papel });
    }

    // tudo abaixo exige login
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : url.searchParams.get('token');
    const user = token && usuarioDoToken(token);
    if (!user) return json(res, 401, { error: 'Não autenticado.' });
    const cid = req.headers['x-client'] || url.searchParams.get('c') || '';

    if (recurso === 'eu' && m === 'GET') return json(res, 200, user);
    if (recurso === 'sair' && m === 'POST') {
      delete sessoes[token];
      save(F_SESS, sessoes);
      return json(res, 200, { ok: true });
    }

    if (recurso === 'eventos' && m === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.write('retry: 2000\n\n');
      const c = { res, user, cid };
      clientes.add(c);
      req.on('close', () => clientes.delete(c));
      return;
    }

    // arquétipos e personalidades de NPC: dados exclusivos do mestre
    if (recurso === 'npcs' && m === 'GET') {
      if (!ehMestre(user)) return json(res, 403, { error: 'Somente o mestre.' });
      return json(res, 200, NPCS);
    }

    if (recurso === 'usuarios') {
      if (!ehMestre(user)) return json(res, 403, { error: 'Somente o mestre.' });
      if (m === 'GET' && !id)
        return json(res, 200, Object.entries(users).map(([usuario, u]) => ({ usuario, nome: u.nome, papel: u.papel })));
      if (m === 'PATCH' && id && !sub) {
        const { usuario = '', senha = '' } = await readBody(req);
        const chave = String(usuario).trim().toLowerCase();
        const novaSenha = String(senha);
        if (!users[id]) return json(res, 404, { error: 'Usuário não encontrado.' });
        if (!USER_OK.test(chave)) return json(res, 400, { error: 'Usuário: 3 a 24 letras, números, _ . -' });
        if (chave !== id && users[chave]) return json(res, 409, { error: 'Usuário já existe.' });
        if (novaSenha && novaSenha.length < 4) return json(res, 400, { error: 'Senha com pelo menos 4 caracteres.' });

        const atualizado = { ...users[id] };
        if (novaSenha) {
          Object.assign(atualizado, novoHash(novaSenha));
          for (const t of Object.keys(sessoes)) if (sessoes[t].usuario === id && t !== token) delete sessoes[t];
        }
        users[chave] = atualizado;
        if (chave !== id) {
          delete users[id];
          for (const ficha of Object.values(fichas)) if (ficha.owner === id) ficha.owner = chave;
          for (const sessao of Object.values(sessoes)) if (sessao.usuario === id) sessao.usuario = chave;
        }
        save(F_USERS, users);
        save(F_FICHAS, fichas);
        save(F_SESS, sessoes);
        return json(res, 200, { usuario: chave, nome: atualizado.nome, papel: atualizado.papel });
      }
      if (m === 'POST' && id && sub === 'senha') {
        const { senha = '' } = await readBody(req);
        if (!users[id]) return json(res, 404, { error: 'Usuário não encontrado.' });
        if (String(senha).length < 4) return json(res, 400, { error: 'Senha com pelo menos 4 caracteres.' });
        Object.assign(users[id], novoHash(String(senha)));
        for (const t of Object.keys(sessoes)) if (sessoes[t].usuario === id && t !== token) delete sessoes[t];
        save(F_USERS, users);
        save(F_SESS, sessoes);
        return json(res, 200, { ok: true });
      }
    }

    if (recurso === 'fichas') {
      if (m === 'GET' && !id)
        return json(res, 200, Object.values(fichas).filter((f) => pode(user, f)).map(comDono));
      if (id && !ID_OK.test(id)) return json(res, 400, { error: 'id inválido' });
      if (m === 'GET') {
        const f = fichas[id];
        return f && pode(user, f) ? json(res, 200, comDono(f)) : json(res, 404, { error: 'não encontrada' });
      }
      if (m === 'PUT') {
        const body = await readBody(req);
        const atual = fichas[id];
        if (atual && !pode(user, atual)) return json(res, 403, { error: 'Sem permissão.' });
        const f = { ...body, id, owner: atual ? atual.owner : user.usuario, updatedAt: Date.now() };
        delete f.donoNome;
        // Jogadores podem gerenciar contadores extras da própria ficha, mas não de outras fichas.
        if (!ehMestre(user)) {
          if (!Array.isArray(body.contadores)) {
            f.contadores = atual && Array.isArray(atual.contadores) ? atual.contadores : [];
          } else {
            f.contadores = body.contadores.filter((c) => c && ID_OK.test(String(c.id || ''))).map((c) => ({
              id: String(c.id),
              nome: String(c.nome || 'Contador').slice(0, 30),
              atual: Math.max(0, Number(c.atual) || 0),
            }));
          }
        }
        fichas[id] = f;
        save(F_FICHAS, fichas);
        emitir('ficha', comDono(f), cid, f);
        return json(res, 200, { ok: true, updatedAt: f.updatedAt });
      }
      if (m === 'DELETE') {
        const f = fichas[id];
        if (!f) return json(res, 200, { ok: true });
        if (!pode(user, f)) return json(res, 403, { error: 'Sem permissão.' });
        delete fichas[id];
        save(F_FICHAS, fichas);
        emitir('excluida', { id }, cid, f);
        return json(res, 200, { ok: true });
      }
    }
    return json(res, 404, { error: 'rota inválida' });
  } catch (e) {
    return json(res, 400, { error: String(e.message || e) });
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) return api(req, res, url);

  let file = path.normalize(path.join(DIST, decodeURIComponent(url.pathname)));
  if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(500); return res.end('Rode "npm run build" antes de "npm start".'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\nFicha Monomania rodando!\n  Neste PC:  http://localhost:${PORT}`);
  for (const list of Object.values(os.networkInterfaces()))
    for (const i of list || [])
      if (i.family === 'IPv4' && !i.internal) console.log(`  Na rede:   http://${i.address}:${PORT}`);
  if (!Object.keys(users).length) console.log('\n  Nenhum usuário ainda: a primeira conta criada será o MESTRE.');
  console.log('');
});
