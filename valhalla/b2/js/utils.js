// utils.js
export function criarSelect(opcoes, valorSelecionado) {
  const select = document.createElement('select');
  opcoes.forEach(opcao => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = opcao;
    if (opcao === valorSelecionado) opt.selected = true;
    select.appendChild(opt);
  });
  return select;
}

export function aplicarCorAtkTotal(td) {
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

export function aplicarEstiloPower() {
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
