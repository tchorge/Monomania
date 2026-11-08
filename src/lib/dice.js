import { LIMITES } from '../data/rules.js';

export const rolar = (lados) => 1 + Math.floor(Math.random() * lados);

// Resultado de um teste: d20 bruto comparado com os limites da perícia
// `total` inclui Pulsões (1d6) somadas ao d20; 1 e 20 naturais valem sempre
export function classificar(d20, valor, total = d20) {
  if (d20 === 1) return 'Desastre';
  if (d20 === 20) return 'Crítico';
  const [n, b, e] = LIMITES[clamp(valor)] || [0, 0, 0];
  if (e && total >= e) return 'Extremo';
  if (b && total >= b) return 'Bom';
  if (n && total >= n) return 'Normal';
  return 'Falha';
}
const clamp = (v) => Math.min(18, Math.max(1, v));

export function testePericia(nome, valor, pulsoes = 0) {
  const d20 = rolar(20);
  const extras = Array.from({ length: pulsoes }, () => rolar(6));
  const total = d20 + extras.reduce((a, b) => a + b, 0);
  return { tipo: 'teste', nome, valor, d20, extras, total, resultado: classificar(d20, valor, total) };
}

// aceita expressões como "2d6 + 1d12 - 2", "d20+3" ou "4"
export function rolarExpr(expr) {
  const texto = expr.replace(/\s+/g, '').toLowerCase();
  if (!texto || !/^[+-]?(\d*d\d+|\d+)([+-](\d*d\d+|\d+))*$/.test(texto)) return null;
  const partes = [];
  for (const [, sinal, termo] of texto.matchAll(/([+-]?)(\d*d\d+|\d+)/g)) {
    const s = sinal === '-' ? -1 : 1;
    const m = /^(\d*)d(\d+)$/.exec(termo);
    if (!m) {
      partes.push({ sinal: s, fixo: Number(termo) });
      continue;
    }
    const q = m[1] ? Number(m[1]) : 1;
    const lados = Number(m[2]);
    if (q < 1 || q > 50 || lados < 2 || lados > 1000) return null;
    partes.push({ sinal: s, q, lados, dados: Array.from({ length: q }, () => rolar(lados)) });
  }
  if (partes.reduce((n, p) => n + (p.q || 0), 0) > 100) return null;
  const total = partes.reduce((t, p) => t + p.sinal * (p.fixo ?? p.dados.reduce((a, b) => a + b, 0)), 0);
  return { tipo: 'livre', nome: texto.replace(/([+-])/g, ' $1 ').trim(), partes, total };
}

// texto curto com os números que saíram: "2d6 [3, 5] + 1d12 [9]"
export function detalheRolagem(r) {
  if (r.tipo === 'teste') {
    return `d20 [${r.d20}]${r.extras.length ? ` + d6 [${r.extras.join(', ')}]` : ''}`;
  }
  return r.partes
    .map((p, i) => {
      const op = i === 0 ? (p.sinal < 0 ? '−' : '') : p.sinal < 0 ? ' − ' : ' + ';
      return p.fixo != null ? `${op}${p.fixo}` : `${op}${p.q}d${p.lados} [${p.dados.join(', ')}]`;
    })
    .join('');
}
