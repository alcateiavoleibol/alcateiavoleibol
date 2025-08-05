const colunasFixas = ['birth', 'charNome', 'power'];
const colunasEditaveis = ['classe', 'level', 'tower', 'berkas', 'vazio', 'sr', 'visualChase', 'anel', 'brinco', 'piercing', 'atkTotal'];

const opcoesClasse = ['1ª Classe', '2ª Classe', '3ª Classe', '4ª Classe', 'Despertar'];
const opcoesLevel = Array.from({ length: 85 }, (_, i) => (i + 1).toString());
const opcoesTower = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
const opcoesAnel = [
  'Nenhum',
  'Harkyon',
  'Dimensão Brilhante I', 'Dimensão Brilhante II', 'Dimensão Brilhante III',
  'Infinito Brilhante I', 'Infinito Brilhante II', 'Infinito Brilhante III',
  'Promessa Incumprível I', 'Promessa Incumprível II', 'Promessa Incumprível III'
];
const opcoesBrinco = [
  'Nenhum',
  'Brinco das Chamas',
  'Brinco de Gnosis',
  'Brinco dos Guardiões Dimensionais I',
  'Brinco dos Guardiões Dimensionais II',
  'Brinco dos Guardiões Dimensionais III',
  'Brincos do Outro Mundo da Ordem',
  'Brincos do Outro Mundo do Caos'
];

const opcoesPiercing = [
  'Nenhum',
  'Piercing dos Guardiões Dimensionais I',
  'Piercing dos Guardiões Dimensionais II',
  'Piercing dos Guardiões Dimensionais III',
  'Piercing do Outro Mundo da Ordem',
  'Piercing do Outro Mundo do Caos'
];

const dadosIniciais = [
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
  { birth: 23, char: "uno", nome: "UNO", power: "AMP" }
];

// Gera as opções para os acessórios (berkas, vazio, sr) conforme índice do personagem
function gerarOpcoesAcessorio(index) {
  const limite = index < 10 ? 15 : 12;
  return Array.from({ length: limite }, (_, i) => (i + 1).toString());
}

function carregarDados() {
  const salvo = localStorage.getItem('valhallabr_dados');
  if (salvo) {
    return JSON.parse(salvo);
  }
  return completarDados(dadosIniciais);
}

function completarDados(lista) {
  return lista.map(item => {
    for (const campo of colunasEditaveis) {
      if (!(campo in item)) item[campo] = '';
    }
    if (!item.brinco) item.brinco = 'Nenhum';
    if (!item.piercing) item.piercing = 'Nenhum';
    if (!item.anel) item.anel = 'Nenhum';
    return item;
  });
}

function salvarDados() {
  const dados = obterDadosDaTabela();
  localStorage.setItem('valhallabr_dados', JSON.stringify(dados));
  alert('Dados salvos no navegador.');
}

function baixarJSON() {
  const dados = obterDadosDaTabela();
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'valhallabr_dados.json';
  a.click();
  URL.revokeObjectURL(url);
}

function carregarArquivo(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const json = JSON.parse(e.target.result);
      localStorage.setItem('valhallabr_dados', JSON.stringify(completarDados(json)));
      criarTabela();
      aplicarEstiloPower();
      alert('Dados carregados com sucesso!');
    } catch (err) {
      alert('Erro ao carregar o arquivo. Verifique o formato.');
    }
  };
  reader.readAsText(file);
}

function obterDadosDaTabela() {
  const linhas = document.querySelectorAll('#tabela-corpo tr');
  const dados = [];
  linhas.forEach((linha) => {
    const celulas = linha.querySelectorAll('td');
    const obj = {
      birth: celulas[0].innerText,
      char: celulas[1].querySelector('img')?.alt || '',
      nome: celulas[1].querySelector('span.nome-personagem')?.innerText || '',
      power: celulas[2].innerText,
      classe: celulas[3].querySelector('select')?.value || '',
      level: celulas[4].querySelector('select')?.value || '',
      tower: celulas[5].querySelector('select')?.value || '',
      berkas: celulas[6].querySelector('select')?.value || '',
      vazio: celulas[7].querySelector('select')?.value || '',
      sr: celulas[8].querySelector('select')?.value || '',
      visualChase: celulas[9].innerText,
      anel: celulas[10].querySelector('select')?.value || '',
      brinco: celulas[11].querySelector('select')?.value || '',
      piercing: celulas[12].querySelector('select')?.value || '',
      atkTotal: celulas[13].innerText
    };
    dados.push(obj);
  });
  return dados;
}

function criarSelect(opcoes, valorSelecionado) {
  const select = document.createElement('select');
  for (const opcao of opcoes) {
    const opt = document.createElement('option');
    opt.value = opcao;
    opt.textContent = opcao;
    if (opcao === valorSelecionado) opt.selected = true;
    select.appendChild(opt);
  }
  return select;
}

function criarTabela() {
  const corpo = document.getElementById('tabela-corpo');
  corpo.innerHTML = '';
  const dados = carregarDados();

  dados.forEach((item, index) => {
    const linha = document.createElement('tr');

    // birth
    const tdBirth = document.createElement('td');
    tdBirth.innerText = item.birth;
    linha.appendChild(tdBirth);

    // personagem (imagem + nome)
    const tdPersonagem = document.createElement('td');
    tdPersonagem.style.display = 'flex';
    tdPersonagem.style.alignItems = 'center';
    tdPersonagem.style.gap = '8px';

    const img = document.createElement('img');
    img.src = `imagens/personagens/${item.char}.png`;
    img.alt = item.char;
    img.classList.add('avatar');
    tdPersonagem.appendChild(img);

    const spanNome = document.createElement('span');
    spanNome.classList.add('nome-personagem');
    spanNome.innerText = item.nome;
    spanNome.style.fontWeight = 'bold';
    spanNome.style.color = '#004477';
    tdPersonagem.appendChild(spanNome);

    linha.appendChild(tdPersonagem);

    // power
    const tdPower = document.createElement('td');
    tdPower.innerText = item.power;
    tdPower.classList.add('power-cell');
    linha.appendChild(tdPower);

    // colunas editáveis
    for (const key of colunasEditaveis) {
      const td = document.createElement('td');

      if (key === 'classe') {
        td.appendChild(criarSelect(opcoesClasse, item[key]));
      } else if (key === 'level') {
        td.appendChild(criarSelect(opcoesLevel, item[key]));
      } else if (key === 'tower') {
        td.appendChild(criarSelect(opcoesTower, item[key]));
      } else if (['berkas', 'vazio', 'sr'].includes(key)) {
        td.appendChild(criarSelect(gerarOpcoesAcessorio(index), item[key]));
      } else if (key === 'anel') {
        td.appendChild(criarSelect(opcoesAnel, item[key]));
      } else if (key === 'brinco') {
        td.appendChild(criarSelect(opcoesBrinco, item[key]));
      } else if (key === 'piercing') {
        td.appendChild(criarSelect(opcoesPiercing, item[key]));
      } else if (key === 'atkTotal') {
        td.innerText = item[key] || '';
        td.contentEditable = true;
        td.classList.add('power-cell');
      } else {
        td.innerText = item[key] || '';
        td.contentEditable = true;
      }

      linha.appendChild(td);
    }

    corpo.appendChild(linha);
  });

  aplicarEstiloPower();
}

function aplicarEstiloPower() {
  document.querySelectorAll('.power-cell').forEach(cell => {
    const value = cell.innerText.trim().toUpperCase();
    if (value === 'MP') {
      cell.style.backgroundColor = '#ffebcd';
      cell.style.color = '#0074d9';
    } else if (value === 'AP') {
      cell.style.backgroundColor = '#ffe4e1';
      cell.style.color = '#c71585';
    } else if (value === 'AMP') {
      cell.style.backgroundColor = '#f0fff0';
      cell.style.color = '#006400';
    }
    cell.style.fontWeight = 'bold';
    cell.style.pointerEvents = 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  criarTabela();
});
