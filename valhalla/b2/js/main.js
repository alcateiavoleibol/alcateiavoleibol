import { criarTabela, obterDadosDaTabela } from './tabela.js';
import { importarJSON, baixarJSON, salvarLocalStorage, carregarDoStorage, exportarCSV } from './storage.js';
import { colunasFixas, colunasEditaveis } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🟢 DOM carregado. Iniciando...');

  // Carrega dados do LocalStorage se existirem
  const dadosStorage = carregarDoStorage();
  if (dadosStorage) {
    window.dadosCarregados = dadosStorage;
  }

  criarTabela();

  // Eventos de Importação
  document.getElementById('importarJSON')?.addEventListener('change', function (e) {
    const arquivo = e.target.files[0];
    if (arquivo) importarJSON(arquivo, () => criarTabela());
  });

  // Exportar JSON
  document.getElementById('btnSalvarArquivo')?.addEventListener('click', (e) => {
    e.preventDefault();
    baixarJSON(obterDadosDaTabela());
  });

  // Exportar CSV
  document.getElementById('btnExportCSV')?.addEventListener('click', () => {
    exportarCSV(obterDadosDaTabela(), colunasFixas, colunasEditaveis);
  });

  // Auto salvar em LocalStorage ao editar
  document.getElementById('tabela-corpo').addEventListener('input', () => {
    salvarLocalStorage(obterDadosDaTabela());
  });

  document.getElementById('tabela-corpo').addEventListener('change', () => {
    salvarLocalStorage(obterDadosDaTabela());
  });

  // Limpar LocalStorage
  document.getElementById('btnLimparStorage')?.addEventListener('click', () => {
    localStorage.removeItem('valhallaDados');
    alert('Dados locais apagados!');
    location.reload();
  });
});
