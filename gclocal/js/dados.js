const colunasFixas = ['birth', 'char', 'nome'];
const colunasEditaveis = ['classe', 'despertar', 'power', 'level', 'tower', 'berkas', 'vazio', 'sr', 'visualChase', 'atkTotal'];

const dadosIniciais = [
  { birth: 1, char: "ELESIS", nome: "JUSTICEIRA" },
  { birth: 2, char: "LIRE", nome: "NOVA" },
  { birth: 3, char: "ARME", nome: "ARQUIMAGA" },
  { birth: 4, char: "LASS", nome: "RETALHADOR" },
  { birth: 5, char: "RYAN", nome: "EXECUTOR" },
  { birth: 6, char: "RONAN", nome: "INQUISIDOR" },
  { birth: 7, char: "AMY", nome: "SUPERSTAR" },
  { birth: 8, char: "JIN", nome: "ILUMINADO" },
  { birth: 9, char: "SIEGHART", nome: "AVATAR" },
  { birth: 10, char: "MARI", nome: "LA GEAS" },
  { birth: 11, char: "DIO", nome: "ASMODEUS" },
  { birth: 12, char: "ZERO", nome: "ANDARILHO" },
  { birth: 13, char: "REY", nome: "IMPERATRIZ DAS TREVAS" },
  { birth: 14, char: "LUPUS", nome: "ESPECIALISTA" },
  { birth: 15, char: "LIN", nome: "ESCOLHIDA" },
  { birth: 16, char: "AZIN", nome: "RYUJIN" },
  { birth: 17, char: "HOLY", nome: "TEMPLÁRIA" },
  { birth: 18, char: "EDEL", nome: "MAJOR" },
  { birth: 19, char: "VEIGAS", nome: "DESTRUIDOR" },
  { birth: 20, char: "DECANE", nome: "BRUXA LUNÁTICA" },
  { birth: 21, char: "AI", nome: "SUPERVISORA" },
  { birth: 22, char: "KALLIA", nome: "SOLUCIONADORA" },
  { birth: 23, char: "UNO", nome: "SOMBRA SANGRENTA" }
];

function carregarDados() {
  const salvo = localStorage.getItem('valhallabr_dados');
  return salvo ? JSON.parse(salvo) : completarDados(dadosIniciais);
}

function completarDados(lista) {
  return lista.map(item => {
    for (const campo of colunasEditaveis) {
      if (!(campo in item)) item[campo] = '';
    }
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
  reader.onload = function(e) {
    try {
      const json = JSON.parse(e.target.result);
      localStorage.setItem('valhallabr_dados', JSON.stringify(completarDados(json)));
      criarTabela();
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
      char: celulas[1].innerText,
      nome: celulas[2].innerText,
      classe: celulas[3].innerText,
      despertar: celulas[4].innerText,
      power: celulas[5].innerText,
      level: celulas[6].innerText,
      tower: celulas[7].innerText,
      berkas: celulas[8].innerText,
      vazio: celulas[9].innerText,
      sr: celulas[10].innerText,
      visualChase: celulas[11].innerText,
      atkTotal: celulas[12].innerText
    };
    dados.push(obj);
  });
  return dados;
}

function criarTabela() {
  const corpo = document.getElementById('tabela-corpo');
  corpo.innerHTML = '';
  const dados = carregarDados();

  dados.forEach((item) => {
    const linha = document.createElement('tr');
    for (const key of ['birth', 'char', 'nome', ...colunasEditaveis]) {
      const celula = document.createElement('td');
      celula.innerText = item[key] || '';
      if (!colunasFixas.includes(key)) {
        celula.contentEditable = true;
      }
      linha.appendChild(celula);
    }
    corpo.appendChild(linha);
  });
}

document.addEventListener('DOMContentLoaded', criarTabela);
