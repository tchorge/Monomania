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

export const ORDEM_RESULTADO = ['Desastre', 'Falha', 'Normal', 'Bom', 'Extremo', 'Crítico'];
// posto de cada resultado para comparar com a DT (Desastre e Falha nunca passam)
const POSTO = { Desastre: 0, Falha: 0, Normal: 1, Bom: 2, Extremo: 3, Crítico: 4 };
export const passouDT = (resultado, dt) => POSTO[resultado] >= POSTO[dt];

// `vant` > 0: vantagens (d20 extras, mantém o maior); < 0: desvantagens (mantém o menor)
export function testePericia(nome, valor, pulsoes = 0, vant = 0, dt = null) {
  const d20s = Array.from({ length: 1 + Math.abs(vant) }, () => rolar(20));
  const d20 = vant > 0 ? Math.max(...d20s) : vant < 0 ? Math.min(...d20s) : d20s[0];
  const extras = Array.from({ length: pulsoes }, () => rolar(6));
  const total = d20 + extras.reduce((a, b) => a + b, 0);
  const resultado = classificar(d20, valor, total);
  return {
    tipo: 'teste', nome, valor, d20, d20s, vant, extras, total, resultado, dt,
    sucesso: dt ? passouDT(resultado, dt) : null,
  };
}

const somar = (partes) =>
  partes.reduce((t, p) => t + p.sinal * (p.fixo ?? p.dados.reduce((a, b) => a + b, 0)), 0);

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
  const total = somar(partes);
  return { tipo: 'livre', nome: texto.replace(/([+-])/g, ' $1 ').trim(), partes, total };
}

// Dano: Extremo ganha +1 dado do mesmo tipo; Crítico ganha +1 dado fixo no valor máximo
export function rolarDano(expr, resultado, extras = 0) {
  const r = rolarExpr(expr);
  if (!r) return null;
  const base = r.partes.find((p) => p.dados);
  const notas = [];
  if (base) {
    if (extras > 0) {
      r.partes.push({ sinal: 1, q: extras, lados: base.lados, dados: Array.from({ length: extras }, () => rolar(base.lados)) });
      notas.push(`+${extras} dado(s) de dano extra (queima-roupa, furtivo etc.).`);
    }
    if (resultado === 'Extremo') {
      r.partes.push({ sinal: 1, q: 1, lados: base.lados, dados: [rolar(base.lados)] });
      notas.push('+1 dado de dano (Extremo).');
    }
    if (resultado === 'Crítico') {
      r.partes.push({ sinal: 1, fixo: base.lados });
      notas.push(`+1 dado de dano fixo no máximo (${base.lados}) (Crítico).`);
    }
  }
  r.total = somar(r.partes);
  r.nome = `Dano ${r.nome} (${resultado})`;
  r.nota = notas.join('\n');
  return r;
}

// texto curto com os números que saíram: "2d6 [3, 5] + 1d12 [9]"
export function detalheRolagem(r) {
  if (r.tipo === 'info') return r.detalhe || '';
  if (r.tipo === 'teste') {
    const d20 = r.d20s && r.d20s.length > 1 ? `d20 [${r.d20s.join(', ')}] → ${r.d20}` : `d20 [${r.d20}]`;
    return `${d20}${r.extras.length ? ` + d6 [${r.extras.join(', ')}]` : ''}`;
  }
  return r.partes
    .map((p, i) => {
      const op = i === 0 ? (p.sinal < 0 ? '−' : '') : p.sinal < 0 ? ' − ' : ' + ';
      return p.fixo != null ? `${op}${p.fixo}` : `${op}${p.q}d${p.lados} [${p.dados.join(', ')}]`;
    })
    .join('');
}
