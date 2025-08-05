// === Configurações Iniciais ===

const colunasFixas = ['birth', 'charNome', 'power'];
const colunasEditaveis = ['classe', 'level', 'tower', 'berkas', 'vazio', 'sr', 'visualChase', 'anel', 'brinco', 'piercing', 'atkTotal'];

const opcoesClasse = ['1ª Classe', '2ª Classe', '3ª Classe', '4ª Classe', 'Despertar'];
const opcoesLevel = Array.from({ length: 85 }, (_, i) => (i + 1).toString());
const opcoesTower = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

const opcoesAnel = [
  'Nenhum', 'Harkyon',
  'Dimensão Brilhante I', 'Dimensão Brilhante II', 'Dimensão Brilhante III',
  'Infinito Brilhante I', 'Infinito Brilhante II', 'Infinito Brilhante III',
  'Promessa Incumprível I', 'Promessa Incumprível II', 'Promessa Incumprível III'
];

const opcoesBrinco = [
  'Nenhum', 'Chamas', 'Gnosis',
  'Guardiões Dimensionais I', 'Guardiões Dimensionais II', 'Guardiões Dimensionais III',
  'Outro Mundo da Ordem', 'Outro Mundo do Caos'
];

const opcoesPiercing = [
  'Nenhum',
  'Guardiões Dimensionais I', 'Guardiões Dimensionais II', 'Guardiões Dimensionais III',
  'Outro Mundo da Ordem', 'Outro Mundo do Caos'
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

let dadosCarregados = null;

// Retorna os dados atuais completos, priorizando os carregados ou dadosIniciais
function carregarDados() {
  return completarDados(dadosCarregados || dadosIniciais);
}

// Importa JSON do arquivo, valida, completa dados, atualiza dadosCarregados e tabela
function importarJSON(arquivo) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const dadosImportados = JSON.parse(e.target.result);
      if (!Array.isArray(dadosImportados)) throw new Error('Formato inválido');
      dadosCarregados = completarDados(dadosImportados);
      criarTabela();
      alert("Perfil carregado com sucesso!");
    } catch (erro) {
      alert("Erro ao importar o arquivo: " + erro.message);
    }
  };
  reader.readAsText(arquivo);
}

// Evento para input do arquivo JSON
document.getElementById('importarJSON')?.addEventListener('change', function (e) {
  const arquivo = e.target.files[0];
  if (arquivo) importarJSON(arquivo);
});

// Obtem os dados atuais da tabela (incluindo valores editados/selecionados), atualiza dadosCarregados e localStorage
function obterDadosDaTabela() {
  const linhas = document.querySelectorAll('#tabela-corpo tr');
  const dados = [];

  linhas.forEach((linha, index) => {
    const celulas = linha.children;

    // Colunas fixas: birth(0), personagem(1), power(2)
    // colunasEditaveis começam no índice 3
    const item = {
      birth: celulas[0].innerText.trim(),
      char: dadosIniciais[index]?.char || '',
      nome: dadosIniciais[index]?.nome || '',
      power: celulas[2].innerText.trim()
    };

    let colIndex = 3;
    for (const key of colunasEditaveis) {
      const td = celulas[colIndex];
      if (!td) {
        item[key] = '';
      } else {
        const select = td.querySelector('select');
        if (select) {
          item[key] = select.value;
        } else {
          item[key] = td.textContent.trim();
        }
      }
      colIndex++;
    }

    dados.push(item);
  });

  dadosCarregados = completarDados(dados);
  // Opcional: salvar localStorage
  // localStorage.setItem('valhallabr_dados', JSON.stringify(dadosCarregados));

  return dadosCarregados;
}

// Salva os dados atuais da tabela em arquivo JSON para download
function baixarJSON() {
  const dados = obterDadosDaTabela();
  const jsonString = JSON.stringify(dados, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'perfil.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Evento botão salvar arquivo JSON
document.getElementById('btnSalvarArquivo')?.addEventListener('click', (e) => {
  e.preventDefault();
  baixarJSON();
});

// Garante que todos os campos obrigatórios existam, preenche acessórios com "Nenhum" se vazio,
// e faz validação básica para evitar valores inválidos que possam quebrar a tabela
function completarDados(lista) {
  return lista.map((item, index) => {
    for (const campo of colunasEditaveis) {
      if (!(campo in item)) item[campo] = '';
    }

    // Padrões para acessórios
    item.brinco ??= 'Nenhum';
    item.piercing ??= 'Nenhum';
    item.anel ??= 'Nenhum';

    // Validação para classe
    if (!opcoesClasse.includes(item.classe)) {
      item.classe = ''; // ou '1ª Classe' se preferir padrão
    }

    // Validação para level
    if (!opcoesLevel.includes(item.level)) {
      item.level = '';
    }

    // Validação para tower
    if (!opcoesTower.includes(item.tower)) {
      item.tower = '';
    }

    // Validação para berkas, vazio e sr (numérico dentro do limite do índice)
    const limiteAcessorio = index < 10 ? 15 : 12;
    if (!gerarOpcoesAcessorio(index).includes(item.berkas)) item.berkas = '';
    if (!gerarOpcoesAcessorio(index).includes(item.vazio)) item.vazio = '';
    if (!gerarOpcoesAcessorio(index).includes(item.sr)) item.sr = '';

    // Validação para visualChase
    if (!gerarOpcoesVisualChase(index).includes(item.visualChase)) item.visualChase = '';

    // Validação para anel, brinco, piercing
    if (!opcoesAnel.includes(item.anel)) item.anel = 'Nenhum';
    if (!opcoesBrinco.includes(item.brinco)) item.brinco = 'Nenhum';
    if (!opcoesPiercing.includes(item.piercing)) item.piercing = 'Nenhum';

    // Validação para atkTotal: aceita apenas números e pontos, ou vazio
    if (item.atkTotal) {
      // remove pontos e espaços para validar número
      const valorNum = parseInt(item.atkTotal.replace(/\./g, '').replace(/\s/g, ''), 10);
      if (isNaN(valorNum)) {
        item.atkTotal = '';
      } else {
        // mantém só números como string formatada (você pode formatar se quiser)
        item.atkTotal = item.atkTotal.trim();
      }
    } else {
      item.atkTotal = '';
    }

    return item;
  });
}

// --- Funções auxiliares existentes ---

function criarSelect(opcoes, valorSelecionado) {
  const select = document.createElement('select');
  opcoes.forEach(opcao => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = opcao;
    if (opcao === valorSelecionado) opt.selected = true;
    select.appendChild(opt);
  });
  return select;
}

function gerarOpcoesAcessorio(index) {
  const limite = index < 10 ? 15 : 12;
  return Array.from({ length: limite + 1 }, (_, i) => i.toString());
}

function gerarOpcoesVisualChase(index) {
  const limite = index < 15 ? 5 : 3;
  return Array.from({ length: limite + 1 }, (_, i) => i.toString());
}

function aplicarEstiloPower() {
  document.querySelectorAll('.power-cell').forEach(cell => {
    const value = cell.innerText.trim().toUpperCase();
    const estilos = {
      MP: { bg: '#ffebcd', color: '#0074d9' },
      AP: { bg: '#ffe4e1', color: '#c71585' },
      AMP: { bg: '#f0fff0', color: '#006400' }
    };

    if (estilos[value]) {
      cell.style.backgroundColor = estilos[value].bg;
      cell.style.color = estilos[value].color;
      cell.style.pointerEvents = 'none';
    } else {
      cell.style.backgroundColor = '';
      cell.style.color = '';
      cell.style.pointerEvents = 'auto';
    }
    cell.style.fontWeight = 'bold';
  });
}

function aplicarCorAtkTotal(td) {
  const valorTexto = td.textContent.replace(/\./g, '').replace(/\s/g, '');
  const valorNum = parseInt(valorTexto, 10);

  if (isNaN(valorNum)) {
    td.style.color = '';
  } else if (valorNum < 200000) {
    td.style.color = 'red';
  } else if (valorNum > 999999) {
    td.style.color = 'green';
  } else if (valorNum > 599999) {
    td.style.color = 'orange';
  } else {
    td.style.color = '';
  }
}

function criarTabela() {
  const corpo = document.getElementById('tabela-corpo');
  if (!corpo) {
    console.warn('⚠️ tbody com id "tabela-corpo" não encontrado!');
    return;
  }

  corpo.innerHTML = '';
  const dados = carregarDados();
  console.log('Criando tabela com dados:', dados);

  dados.forEach((item, index) => {
    const linha = document.createElement('tr');

    const tdBirth = document.createElement('td');
    tdBirth.innerText = item.birth;
    linha.appendChild(tdBirth);

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
    tdPersonagem.appendChild(spanNome);
    linha.appendChild(tdPersonagem);

    const tdPower = document.createElement('td');
    tdPower.innerText = item.power;
    tdPower.classList.add('power-cell');
    linha.appendChild(tdPower);

    for (const key of colunasEditaveis) {
      const td = document.createElement('td');
      if (['level', 'tower', 'berkas', 'vazio', 'sr', 'visualChase'].includes(key)) {
        td.style.textAlign = 'center';
      }

      if (key === 'classe') td.appendChild(criarSelect(opcoesClasse, item[key]));
      else if (key === 'level') td.appendChild(criarSelect(opcoesLevel, item[key]));
      else if (key === 'tower') td.appendChild(criarSelect(opcoesTower, item[key]));
      else if (['berkas', 'vazio', 'sr'].includes(key)) td.appendChild(criarSelect(gerarOpcoesAcessorio(index), item[key]));
      else if (key === 'visualChase') td.appendChild(criarSelect(gerarOpcoesVisualChase(index), item[key]));
      else if (key === 'anel') td.appendChild(criarSelect(opcoesAnel, item[key]));
      else if (key === 'brinco') td.appendChild(criarSelect(opcoesBrinco, item[key]));
      else if (key === 'piercing') td.appendChild(criarSelect(opcoesPiercing, item[key]));
      else if (key === 'atkTotal') {
        td.textContent = item[key] || '';
        td.contentEditable = true;
        td.classList.add('power-cell');
        aplicarCorAtkTotal(td);
        td.addEventListener('input', () => aplicarCorAtkTotal(td));
      } else {
        td.textContent = item[key] || '';
        td.contentEditable = true;
      }

      linha.appendChild(td);
    }

    corpo.appendChild(linha);
  });

  aplicarEstiloPower();
  adicionarBotoesOcultarColuna();
}

// === FUNÇÕES DE CONTROLE DE COLUNAS ===

function adicionarBotoesOcultarColuna() {
  const tabela = document.querySelector('table');
  if (!tabela) return;

  const theadTr = tabela.querySelector('thead tr');
  theadTr.querySelectorAll('.btn-ocultar-coluna').forEach(btn => btn.remove());

  theadTr.querySelectorAll('th.toggle-col').forEach(th => {
    const btn = document.createElement('button');
    btn.classList.add('btn-ocultar-coluna');
    btn.title = `Ocultar coluna ${th.textContent.trim()}`;
    btn.style.marginLeft = '6px';
    btn.style.fontSize = '0.85rem';
    btn.style.cursor = 'pointer';
    btn.style.border = 'none';
    btn.style.background = 'transparent';
    btn.style.color = 'white';

    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleColVisibility(th.dataset.col);
    });

    th.appendChild(btn);
  });
}

function toggleColVisibility(colName) {
  const table = document.querySelector('table');
  if (!table) return;

  const ths = Array.from(table.querySelectorAll('thead th'));
  const colIndex = ths.findIndex(th => th.dataset.col === colName);
  if (colIndex === -1) return;

  const isHidden = ths[colIndex].classList.contains('col-hidden');
  ths[colIndex].classList.toggle('col-hidden', !isHidden);

  table.querySelectorAll('tbody tr').forEach(row => {
    const td = row.children[colIndex];
    if (td) td.classList.toggle('col-hidden', !isHidden);
  });
}

function mostrarColuna(colName) {
  const table = document.querySelector('table');
  if (!table) return;
  const ths = Array.from(table.querySelectorAll('thead th'));
  const colIndex = ths.findIndex(th => th.dataset.col === colName);
  if (colIndex === -1) return;
  ths[colIndex].classList.remove('col-hidden');
  table.querySelectorAll('tbody tr').forEach(row => {
    const td = row.children[colIndex];
    if (td) td.classList.remove('col-hidden');
  });
}

function mostrarTodasColunas() {
  const table = document.querySelector('table');
  if (!table) return;
  table.querySelectorAll('thead th, tbody td').forEach(cell => {
    cell.classList.remove('col-hidden');
  });
}

// Configura para que ao clicar no cabeçalho da coluna ele faça toggle da visibilidade
function configurarCabecalhosToggle() {
  document.querySelectorAll('th.toggle-col').forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      toggleColVisibility(header.dataset.col);
    });
  });
}

// Configura o dropdown para mostrar colunas escondidas
function configurarDropdownColunas() {
  const selectColunas = document.getElementById('selectColunas');
  const tabela = document.querySelector('table');
  const thead = tabela.querySelector('thead tr');

  if (selectColunas && thead) {
    selectColunas.innerHTML = `<option value="" disabled selected>Selecionar</option>`;
    Array.from(thead.children).forEach(th => {
      const colName = th.dataset.col;
      if (colName && colName !== 'charNome' && colName !== 'birth') {
        const option = document.createElement('option');
        option.value = colName;
        option.textContent = colName
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        selectColunas.appendChild(option);
      }
    });
  }

  document.getElementById('btnMostrarColuna')?.addEventListener('click', () => {
    const colName = selectColunas.value;
    if (colName) mostrarColuna(colName);
  });

  document.getElementById('btnMostrarTudo')?.addEventListener('click', mostrarTodasColunas);
}

// Configura scroll sincronizado + arrastar para rolar horizontalmente
function configurarScrollSincronizado() {
  const scrollTop = document.getElementById('scrollbarTop');
  const scrollContainer = document.getElementById('scrollContainer');
  const tabela = document.querySelector('table');

  if (scrollTop && scrollContainer && tabela) {
    const tabelaClone = tabela.cloneNode(true);
    tabelaClone.style.visibility = 'hidden';
    tabelaClone.style.pointerEvents = 'none';
    tabelaClone.style.width = tabela.offsetWidth + 'px';
    scrollTop.innerHTML = '';
    scrollTop.appendChild(tabelaClone);

    scrollTop.addEventListener('scroll', () => {
      scrollContainer.scrollLeft = scrollTop.scrollLeft;
    });
    scrollContainer.addEventListener('scroll', () => {
      scrollTop.scrollLeft = scrollContainer.scrollLeft;
    });

    let isDown = false, startX, scrollLeftStart;
     scrollContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      scrollContainer.classList.add('dragging');
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeftStart = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
      isDown = false;
      scrollContainer.classList.remove('dragging');
    });

    scrollContainer.addEventListener('mouseup', () => {
      isDown = false;
      scrollContainer.classList.remove('dragging');
    });

    scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 1.5; // velocidade do scroll
      scrollContainer.scrollLeft = scrollLeftStart - walk;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🟢 DOM carregado. Iniciando...');
  criarTabela();
  configurarCabecalhosToggle();
  configurarDropdownColunas();
  configurarScrollSincronizado();

  if (!document.getElementById('tabela-corpo')) console.warn('⚠️ tbody#tabela-corpo não encontrado.');
  if (!document.getElementById('importarJSON')) console.warn('⚠️ input#importarJSON não encontrado.');
  if (!document.getElementById('btnSalvarArquivo')) console.warn('⚠️ botão#btnSalvarArquivo não encontrado.');
});
