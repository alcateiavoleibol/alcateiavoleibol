// tabela.js
import { colunasFixas, colunasEditaveis, opcoesClasse, opcoesLevel, opcoesTower, opcoesAnel, opcoesBrinco, opcoesPiercing, dadosIniciais } from './config.js';
import { criarSelect, aplicarEstiloPower, aplicarCorAtkTotal } from './utils.js';

export let dadosCarregados = null;

export function completarDados(lista) {
  return lista.map((item, index) => {
    colunasEditaveis.forEach(campo => {
      if (!(campo in item)) item[campo] = '';
    });

    item.brinco ??= 'Nenhum';
    item.piercing ??= 'Nenhum';
    item.anel ??= 'Nenhum';

    if (!opcoesClasse.includes(item.classe)) item.classe = '';
    if (!opcoesLevel.includes(item.level)) item.level = '';
    if (!opcoesTower.includes(item.tower)) item.tower = '';

    return item;
  });
}

export function criarTabela() {
  const corpo = document.getElementById('tabela-corpo');
  corpo.innerHTML = '';
  const dados = dadosCarregados || dadosIniciais;

  dados.forEach((item, index) => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${item.birth}</td>
      <td>${item.nome}</td>
      <td class="power-cell">${item.power}</td>
    `;

    colunasEditaveis.forEach(key => {
      const td = document.createElement('td');
      if (key === 'classe') td.appendChild(criarSelect(opcoesClasse, item[key]));
      else if (key === 'level') td.appendChild(criarSelect(opcoesLevel, item[key]));
      else if (key === 'tower') td.appendChild(criarSelect(opcoesTower, item[key]));
      else if (key === 'anel') td.appendChild(criarSelect(opcoesAnel, item[key]));
      else if (key === 'brinco') td.appendChild(criarSelect(opcoesBrinco, item[key]));
      else if (key === 'piercing') td.appendChild(criarSelect(opcoesPiercing, item[key]));
      else if (key === 'atkTotal') {
        td.textContent = item[key] || '';
        td.contentEditable = true;
        td.classList.add('power-cell');
        td.addEventListener('input', () => aplicarCorAtkTotal(td));
      } else {
        td.textContent = item[key] || '';
        td.contentEditable = true;
      }
      linha.appendChild(td);
    });

    corpo.appendChild(linha);
  });

  aplicarEstiloPower();
}

export function obterDadosDaTabela() {
  const linhas = document.querySelectorAll('#tabela-corpo tr');
  const dados = [];
  linhas.forEach((linha, index) => {
    const celulas = linha.children;
    const item = {
      birth: celulas[0].innerText.trim(),
      nome: celulas[1].innerText.trim(),
      power: celulas[2].innerText.trim()
    };
    let colIndex = 3;
    colunasEditaveis.forEach(key => {
      const td = celulas[colIndex];
      const select = td.querySelector('select');
      item[key] = select ? select.value : td.textContent.trim();
      colIndex++;
    });
    dados.push(item);
  });
  dadosCarregados = completarDados(dados);
  return dadosCarregados;
}
