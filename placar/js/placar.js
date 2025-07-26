let tempo = 0;
let intervalo = null;
let partidaIniciada = false;

function atualizarCronometro() {
  const horas = String(Math.floor(tempo / 3600)).padStart(2, '0');
  const minutos = String(Math.floor((tempo % 3600) / 60)).padStart(2, '0');
  const segundos = String(tempo % 60).padStart(2, '0');
  document.getElementById('cronometro').textContent = `${horas}:${minutos}:${segundos}`;
  tempo++;
  salvarEstado();
}

function iniciarPartida() {
  if (!partidaIniciada) {
    intervalo = setInterval(atualizarCronometro, 1000);
    partidaIniciada = true;
  }
}

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
  salvarEstado();
}

function resetarPontos() {
  document.getElementById('pontos1').textContent = '0';
  document.getElementById('pontos2').textContent = '0';
  salvarEstado();
}

function alterarPonto(time, valor) {
  if (!partidaIniciada) return;
  const id = time === 'time1' ? 'pontos1' : 'pontos2';
  const elemento = document.getElementById(id);
  let atual = parseInt(elemento.textContent);
  atual = Math.max(0, atual + valor);
  elemento.textContent = atual;
  salvarEstado();
}

function alterarSet(setId, valor) {
  const elemento = document.getElementById(setId);
  let atual = parseInt(elemento.innerText);
  atual = Math.max(0, atual + valor);
  elemento.innerText = atual;
  salvarEstado();
}

function alternarTelaCheia() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => alert(`Erro: ${err.message}`));
  } else {
    document.exitFullscreen();
  }
}

function girarTela() {
  document.body.classList.toggle('girado');
}

function atualizarDataHora() {
  const dataHora = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour12: false
  });
  document.getElementById('dataHora').textContent = dataHora;
}

setInterval(atualizarDataHora, 1000);
window.onload = () => {
  atualizarDataHora();
  carregarEstado();
};

function salvarEstado() {
  const estado = {
    tempo,
    pontos1: document.getElementById('pontos1').textContent,
    pontos2: document.getElementById('pontos2').textContent,
    set1: document.getElementById('set1').textContent,
    set2: document.getElementById('set2').textContent,
    cronometro: document.getElementById('cronometro').textContent
  };
  localStorage.setItem('placarEstado', JSON.stringify(estado));
}

function carregarEstado() {
  const estado = JSON.parse(localStorage.getItem('placarEstado'));
  if (estado) {
    tempo = estado.tempo;
    document.getElementById('pontos1').textContent = estado.pontos1;
    document.getElementById('pontos2').textContent = estado.pontos2;
    document.getElementById('set1').textContent = estado.set1;
    document.getElementById('set2').textContent = estado.set2;
    document.getElementById('cronometro').textContent = estado.cronometro;
  }
}
