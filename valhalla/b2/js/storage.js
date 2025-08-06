// storage.js
import { completarDados } from './tabela.js';

export function salvarLocalStorage(dados) {
  localStorage.setItem('valhallaDados', JSON.stringify(dados));
}

export function carregarDoStorage() {
  const dados = localStorage.getItem('valhallaDados');
  return dados ? JSON.parse(dados) : null;
}

export function importarJSON(arquivo, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const dadosImportados = JSON.parse(e.target.result);
      if (!Array.isArray(dadosImportados)) throw new Error('Formato inválido');
      callback(dadosImportados);
    } catch (erro) {
      alert("Erro ao importar o arquivo: " + erro.message);
    }
  };
  reader.readAsText(arquivo);
}

export function baixarJSON(dados) {
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
