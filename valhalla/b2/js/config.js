// config.js
export const colunasFixas = ['birth', 'charNome', 'power'];
export const colunasEditaveis = ['classe', 'level', 'tower', 'berkas', 'vazio', 'sr', 'visualChase', 'anel', 'brinco', 'piercing', 'atkTotal'];

export const opcoesClasse = ['1ª Classe', '2ª Classe', '3ª Classe', '4ª Classe', 'Despertar'];
export const opcoesLevel = Array.from({ length: 85 }, (_, i) => (i + 1).toString());
export const opcoesTower = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

export const opcoesAnel = ['Nenhum', 'Harkyon', 'Dimensão Brilhante I', 'Dimensão Brilhante II', 'Dimensão Brilhante III', 'Infinito Brilhante I', 'Infinito Brilhante II', 'Infinito Brilhante III', 'Promessa Incumprível I', 'Promessa Incumprível II', 'Promessa Incumprível III'];
export const opcoesBrinco = ['Nenhum', 'Chamas', 'Gnosis', 'Guardiões Dimensionais I', 'Guardiões Dimensionais II', 'Guardiões Dimensionais III', 'Outro Mundo da Ordem', 'Outro Mundo do Caos'];
export const opcoesPiercing = ['Nenhum', 'Guardiões Dimensionais I', 'Guardiões Dimensionais II', 'Guardiões Dimensionais III', 'Outro Mundo da Ordem', 'Outro Mundo do Caos'];

export const dadosIniciais = [
  { birth: 1, char: "elesis", nome: "ELESIS", power: "MP" },
  { birth: 2, char: "lire", nome: "LIRE", power: "MP" },
  { birth: 3, char: "arme", nome: "ARME", power: "MP" },
  { birth: 4, char: "lass", nome: "LASS", power: "MP" },
  { birth: 5, char: "ryan", nome: "RYAN", power: "MP" },
  { birth: 6, char: "ronan", nome: "RONAN", power: "MP" },
  { birth: 7, char: "amy", nome: "AMY", power: "MP" },
  { birth: 8, char: "jin", nome: "JIN", power: "MP" },
  { birth: 9, char: "sieghart", nome: "SIEGHART", power: "MP" },
  { birth: 10, char: "mari", nome: "MARI", power: "MP" },
  { birth: 11, char: "dio", nome: "DIO", power: "AP" },
  { birth: 12, char: "zero", nome: "ZERO", power: "AP" },
  { birth: 13, char: "rey", nome: "REY", power: "AP" },
  { birth: 14, char: "lupus", nome: "LUPUS", power: "AP" },
  { birth: 15, char: "lin", nome: "LIN", power: "AMP" },
  { birth: 16, char: "azin", nome: "AZIN", power: "AMP" },
  { birth: 17, char: "holy", nome: "HOLY", power: "AMP" },
  { birth: 18, char: "edel", nome: "EDEL", power: "AMP" },
  { birth: 19, char: "veigas", nome: "VEIGAS", power: "AMP" },
  { birth: 20, char: "decane", nome: "DECANE", power: "AMP" },
  { birth: 21, char: "ai", nome: "AI", power: "AMP" },
  { birth: 22, char: "kallia", nome: "KALLIA", power: "AMP" },
  { birth: 23, char: "uno", nome: "UNO", power: "AMP" },
  { birth: 24, char: "harpe", nome: "HARPE", power: "AMP" }
];
