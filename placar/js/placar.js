// placar.js - Controle Avançado do Placar com Estado Persistente e Som

// Variáveis Globais
let tempo = 0; // Tempo do cronômetro (em segundos)
let intervalo = null; // ID do setInterval do cronômetro
let partidaIniciada = false; // Flag se a partida está em andamento
let historicoPontos = []; // Armazena ações para desfazer pontos/sets

const somApito = document.getElementById('somApito'); // Elemento de som (apito)

// Atualiza o cronômetro a cada segundo
function atualizarCronometro() {
  const horas = String(Math.floor(tempo / 3600)).padStart(2, '0');
  const minutos = String(Math.floor((tempo % 3600) / 60)).padStart(2, '0');
  const segundos = String(tempo % 60).padStart(2, '0');
  document.getElementById('cronometro').textContent = `${horas}:${minutos}:${segundos}`;
  tempo++;
  salvarEstado(); // Salva o estado a cada segundo
}

// Inicia o cronômetro da partida
function iniciarPartida() {
  if (!partidaIniciada) {
    intervalo = setInterval(atualizarCronometro, 1000);
    partidaIniciada = true;
  }
}

// Reseta a partida inteira (cronômetro, pontos, sets)
function resetarPartida() {
  clearInterval(intervalo);
  intervalo = null;
  tempo = 0;
  partidaIniciada = false;
  document.getElementById('cronometro').textContent = '00:00:00';
  document.getElementById('pontos1').textContent = '0';
  document.getElementById('pontos2').textContent = '0';
  document.getElementById('set1').textContent = '0';
  document.getElementById('set2').textContent = '0';
  historicoPontos = [];
  salvarEstado();
}

// Reseta apenas os pontos (mantém sets e cronômetro)
function resetarPontos() {
  document.getElementById('pontos1').textContent = '0';
  document.getElementById('pontos2').textContent = '0';
  historicoPontos = [];
  salvarEstado();
}

// Altera a pontuação de um time (time1 ou time2)
function alterarPonto(time, valor) {
  if (!partidaIniciada) return; // Só permite alterar se a partida estiver iniciada

  const id = time === 'time1' ? 'pontos1' : 'pontos2';
  const elemento = document.getElementById(id);
  let atual = parseInt(elemento.textContent);
  atual = Math.max(0, atual + valor); // Garante que não fique negativo
  elemento.textContent = atual;

  if (valor > 0) {
    somApito.currentTime = 0;
    somApito.play(); // Toca o som ao adicionar ponto
  }

  historicoPontos.push({ tipo: 'ponto', time, valor: -valor }); // Armazena para possível desfazer
  salvarEstado();
}

// Altera o número de sets
function alterarSet(setId, valor) {
  const elemento = document.getElementById(setId);
  let atual = parseInt(elemento.textContent);
  atual = Math.max(0, atual + valor);
  elemento.textContent = atual;

  historicoPontos.push({ tipo: 'set', setId, valor: -valor });
  salvarEstado();
}

// Desfaz a última ação (ponto ou set)
function desfazerPonto() {
  if (historicoPontos.length === 0) return;

  const ultimo = historicoPontos.pop();
  if (ultimo.tipo === 'ponto') {
    const id = ultimo.time === 'time1' ? 'pontos1' : 'pontos2';
    const elemento = document.getElementById(id);
    let atual = parseInt(elemento.textContent);
    atual = Math.max(0, atual + ultimo.valor);
    elemento.textContent = atual;
  } else if (ultimo.tipo === 'set') {
    const elemento = document.getElementById(ultimo.setId);
    let atual = parseInt(elemento.textContent);
    atual = Math.max(0, atual + ultimo.valor);
    elemento.textContent = atual;
  }

  salvarEstado();
}

// Alterna o modo tela cheia
function alternarTelaCheia() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch((err) => {
      alert(`Erro ao entrar em tela cheia: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// Gira a tela e força orientação landscape (experimental)
function girarTela() {
  document.body.classList.toggle('girado');
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => {});
  }

  // Tentativa de forçar comportamento de tela cheia em mobile (experimental)
  if (navigator.userAgent.includes("Android") || navigator.userAgent.includes("iPhone")) {
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, view: window });
    document.dispatchEvent(event);
  }
}

// Atualiza a data e hora no topo a cada segundo
function atualizarDataHora() {
  const dataHora = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour12: false,
  });
  document.getElementById('dataHora').textContent = dataHora;
}

setInterval(atualizarDataHora, 1000); // Atualiza data/hora continuamente

// Carrega o estado salvo no localStorage ao iniciar a página
window.onload = () => {
  atualizarDataHora();
  carregarEstado();
};

// Salva o estado atual no localStorage
function salvarEstado() {
  const estado = {
    tempo,
    pontos1: document.getElementById('pontos1').textContent,
    pontos2: document.getElementById('pontos2').textContent,
    set1: document.getElementById('set1').textContent,
    set2: document.getElementById('set2').textContent,
    cronometro: document.getElementById('cronometro').textContent,
    historicoPontos,
  };
  localStorage.setItem('placarEstado', JSON.stringify(estado));
}

// Carrega o estado salvo do localStorage
function carregarEstado() {
  const estado = JSON.parse(localStorage.getItem('placarEstado'));
  if (estado) {
    tempo = estado.tempo;
    document.getElementById('pontos1').textContent = estado.pontos1;
    document.getElementById('pontos2').textContent = estado.pontos2;
    document.getElementById('set1').textContent = estado.set1;
    document.getElementById('set2').textContent = estado.set2;
    document.getElementById('cronometro').textContent = estado.cronometro;
    historicoPontos = estado.historicoPontos || [];
  }
}

// Funções para adicionar/remover ponto via toque (mobile)
function incrementarTouch(time) {
  alterarPonto(time, 1);
}

function decrementarTouch(time) {
  alterarPonto(time, -1);
}
