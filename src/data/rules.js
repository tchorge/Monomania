export const ESPECIAIS = [
  { key: 'AGI', nome: 'Agilidade' },
  { key: 'FOR', nome: 'Força' },
  { key: 'INT', nome: 'Intelecto' },
  { key: 'PRE', nome: 'Presença' },
  { key: 'VIG', nome: 'Vigor' },
  { key: 'VON', nome: 'Vontade' },
];

export const PERICIAS = [
  'Acalmar', 'Analisar', 'Atualidades', 'Atletismo', 'Burocracia', 'C. Exatas',
  'C. Humanas', 'C. Naturais', 'Defender', 'Destreza', 'Diplomacia', 'Furtividade',
  'Intimidação', 'Lutar', 'Malandragem', 'Medicina', 'Memória', 'Ocultismo',
  'Percepção', 'Pesquisar', 'Pilotagem', 'Pontaria', 'Preparação', 'Religião',
  'Sobrevivência', 'Tática', 'Tecnologia', 'Uso de Arma Branca', 'Uso de Arma de Fogo', 'Vasculhar',
];

export const TRACOS = [
  { key: 'PER', nome: 'Perspicácia' },
  { key: 'AUD', nome: 'Audácia' },
  { key: 'DET', nome: 'Determinação' },
  { key: 'VIR', nome: 'Virtude' },
  { key: 'DES', nome: 'Desbrio' },
  { key: 'RAC', nome: 'Raciocínio' },
];

// Sugestões de Monomanias por Traço (a descrição completa fica no livro)
export const MONOMANIAS = {
  PER: ['Adrenalina de Fuga', 'Fuga Vermelha', 'Queda de Gato', 'Estado de Alerta', 'Intuição Impecável', 'Nananinanão', 'Dois em Um', 'Problema Nenhum!', 'Processamento Rápido', 'Um Gato na Caixa', 'Mente Aberta', 'Já vi de Tudo!', 'Impulso Ágil', 'De Raspão!', 'Sequência Veloz', 'Identificador de Brechas', 'Uma Coisa Leva a Outra', 'Performance Otimizada'],
  AUD: ['Para Cima de Você!', 'Quem é a Ameaça Aqui?', 'Adrenalina de Combate', 'Zombação', 'Mano a Mano', 'Aposta Mortal', 'Encaçapado!', 'À Moda Antiga', 'Provocação Perigosa', 'Jogada Arriscada', 'Estupidamente Genial', 'O Dobro ou Nada', 'Imprudência Convicta'],
  DET: ['Espírito Inabalável', 'Um Toque de Otimismo', 'Muito Jovem para Morrer', 'Despertar ao Pacto', 'Segunda Chance', 'Na Força do Ódio', 'Força Interior', 'Instinto de Sobrevivência', 'Duro na Queda', 'Espírito de Líder', 'Resiliência de Ferro', 'Lobo Solitário', 'Sem Tempo para Distrações', 'Golpe Cirúrgico', 'Bater em Retirada', 'Você Não me Escapa!', 'Santa Teimosia'],
  VIR: ['Estou com Você!', 'Anjo da Guarda', 'Só Por Cima do Meu Cadáver', 'Apoio Moral', 'Contato Milagroso', 'Cão de Guarda', 'Justiça Sob Minhas Mãos', 'Conversa Terapêutica', 'Fonte de Inspiração', 'Palavra de Honestidade', 'Alto Astral', 'Vínculo Altruísta'],
  DES: ['Mãos Sujas', 'Oferta de Sangue', 'Aura Sombrosa', 'Na Pele do Lobo', 'Mal Olhado', 'Brincando com a Presa', 'Pipoca de Crânios', 'Familiar das Sombras', 'Música para os meus Ouvidos', 'Presença Desconcertante', 'Sussurros do Abismo'],
  RAC: ['Reanalisar', 'Confins da Memória', 'Conhecimentos Gerais', 'Detecção de Sinais', 'Paciência', 'Análise Tática', 'Jogo Mental', 'Epifania', 'Impulso Cognitivo', 'Arte da Dedução', 'Racionalização'],
};

export const CAPACIDADE = ['', 'Quase Inútil', 'Terrível', 'Incompetente', 'Desqualificado', 'Leigo', 'Amador', 'Iniciante', 'Básico', 'Mediano', 'Competente', 'Treinado', 'Profissional Júnior', 'Profissional Médio', 'Profissional Experiente', 'Especialista', 'Mestre', 'Gênio', 'Lendário'];

// valor da perícia -> [normal, bom, extremo] (menor d20 que atinge o resultado; 0 = impossível)
export const LIMITES = [
  null,
  [0, 0, 0], [19, 0, 0], [18, 19, 0], [17, 19, 0], [16, 19, 0], [15, 19, 0],
  [14, 18, 19], [13, 18, 19], [12, 18, 19], [11, 17, 19], [10, 17, 18],
  [9, 16, 18], [8, 16, 18], [7, 15, 17], [6, 15, 17], [5, 14, 16],
  [4, 14, 16], [3, 13, 15],
];

export const PONTOS_PARTIDA = ['Mundano', 'Emergente', 'Hábil', 'Avançado', 'Exímio'];
// valor -> quantidade de usos permitida por categoria
export const TABELA_PARTIDA = {
  1: [2, 1, 0, 0, 0], 2: [2, 2, 0, 0, 0], 3: [3, 2, 2, 0, 0], 4: [3, 2, 2, 2, 0],
  5: [4, 3, 3, 3, 3], 6: [4, 4, 3, 3, 3], 7: [4, 4, 4, 3, 3], 8: [4, 4, 4, 4, 4],
  9: [4, 4, 5, 4, 4], 10: [3, 4, 5, 5, 5], 11: [2, 3, 4, 5, 5], 12: [1, 2, 2, 3, 3],
  13: [0, 1, 1, 2, 3], 14: [0, 0, 1, 1, 1], 15: [0, 0, 0, 1, 1], 16: [0, 0, 0, 0, 1],
  17: [0, 0, 0, 0, 0], 18: [0, 0, 0, 0, 0],
};

export const NIVEIS_PRESENCA = ['', 'Severamente Comprometido', 'Baixa Capacidade', 'Limiar Baixo', 'Normal', 'Acima da Média', 'Altamente Desenvolvido', 'Excepcional', 'Genial', 'Supergenial', 'Lendário'];

export const POTENCIAL_MEDO = [
  { nivel: 1, abaixo: 80, nome: 'Sentimento Estranho' },
  { nivel: 2, abaixo: 70, nome: 'Mente Sobrecarregada' },
  { nivel: 3, abaixo: 60, nome: 'Pesadelos Frequentes' },
  { nivel: 4, abaixo: 50, nome: 'Alucinações' },
  { nivel: 5, abaixo: 40, nome: 'Manias Inabituais' },
  { nivel: 6, abaixo: 30, nome: 'Lacunas de Memória' },
  { nivel: 7, abaixo: 20, nome: 'Transtornos Graves' },
  { nivel: 8, abaixo: 10, nome: 'Rumo ao Desconhecido' },
];

export const STATUS = [
  { attr: 'Agilidade', bom: 'Ligeiro', ruim: 'Suscetível' },
  { attr: 'Percepção', bom: 'Atento', ruim: 'Alheio' },
  { attr: 'Presença', bom: 'Destacado', ruim: 'Ofuscado' },
  { attr: 'Vontade', bom: 'Motivado', ruim: 'Cabisbaixo' },
  { attr: 'Intelecto', bom: 'Concentrado', ruim: 'Disperso' },
  { attr: 'Vigor', bom: 'Renovado', ruim: 'Exaurido' },
  { attr: 'Força', bom: 'Fortalecido', ruim: 'Enfraquecido' },
];
export const CONDICOES = ['Concussão', 'Pasmo', 'Sangramento', 'Exaustão'];

export const RAIO = ['Colado', 'Muito Perto', 'Perto', 'Próximo', 'Razoável', 'Meio a Meio', 'Afastado', 'Distante', 'Muito Distante', 'Remoto', 'Fuga'];

export const DESCANSO = [
  { h: '1h', pv: '0', ps: '+1' },
  { h: '2–3h', pv: '+1', ps: '+1d2' },
  { h: '4–7h', pv: '+1d2', ps: '+1d3' },
  { h: '8–11h', pv: '+1d3', ps: '+1d4' },
  { h: '12h+', pv: '+1d4', ps: '+1d6' },
];

const faixa = (v, tabela) => {
  for (const [max, res] of tabela) if (v <= max) return res;
  return tabela[tabela.length - 1][1];
};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const med = (a, b) => Math.round((a + b) / 2);

export const deslocamento = (agi) => faixa(agi, [[4, 4], [8, 6], [12, 8], [15, 10], [99, 12]]);
export const dadoForca = (f) => faixa(f, [[4, '1'], [8, '1d2'], [12, '1d3'], [15, '1d4'], [99, '1d6']]);
export const pvMaximo = (vig) =>
  faixa(vig, [[3, 15], [6, 16], [9, 17], [12, 18], [14, 19], [15, 20], [16, 21], [17, 22], [99, 23]]);
export const nivelPresenca = (pre, intel, von) => {
  const v = med(pre, Math.max(intel, von));
  return faixa(v, [[1, 1], [3, 2], [5, 3], [12, 4], [13, 5], [14, 6], [15, 7], [16, 8], [17, 9], [99, 10]]);
};
// corpo/bolsos = metade da Força; equipamentos somam, até o total (= Força); nunca mais que o dobro
export const capacidadeCarga = (f, bonus = 0) => {
  const corpo = Math.ceil(f / 2);
  return { corpo, total: Math.min(f, corpo + Math.max(0, bonus)), limite: f * 2 };
};

export const medoAtual = (psPct) => {
  if (psPct <= 0) return { nivel: 9, nome: 'Insanidade permanente' };
  let r = null;
  for (const p of POTENCIAL_MEDO) if (psPct < p.abaixo) r = p;
  return r;
};

export const novaFicha = () => ({
  id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  nome: '', idade: '', alturaPeso: '', campanha: '', jogador: '', aparencia: '', foto: '',
  especiais: { AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1, VON: 1 },
  pericias: Object.fromEntries(PERICIAS.map((p) => [p, 1])),
  monomanias: [],
  pv: { atual: 15, extra: 0, nota: '' },
  ps: { atual: 100, nota: '' },
  pulsoes: { atual: 0, nota: '' },
  pp: { atual: 0, max: 0, nota: '' },
  pontoPartida: 0,
  raio: 5,
  inventario: [],
  status: {},
  condicoes: [],
  combate: '',
  anotacoes: '',
});
