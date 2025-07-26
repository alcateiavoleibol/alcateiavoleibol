let tempo = 0;
let intervalo = null;
let partidaIniciada = false;

function atualizarCronometro() {
  const minutos = String(Math.floor(tempo / 60)).padStart(2, '0');
  const segundos = String(tempo % 60).padStart(2, '0');
  document.getElementById('cronometro').textContent = `${minutos}:${segundos}`;
  tempo++;
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
  document.getElementById('cronometro').textContent = '00:00';

  document.getElementById('pontos1').textContent = '0';
  document.getElementById('pontos2').textContent = '0';
  document.getElementById('set1').textContent = '0';
  document.getElementById('set2').textContent = '0';
}

function resetarPontos() {
  document.getElementById('pontos1').textContent = '0';
  document.getElementById('pontos2').textContent = '0';
}

function alterarPonto(time, valor) {
  if (!partidaIniciada) return;
  const id = time === 'time1' ? 'pontos1' : 'pontos2';
  const elemento = document.getElementById(id);
  let atual = parseInt(elemento.textContent);
  atual = Math.max(0, atual + valor);
  elemento.textContent = atual;
}

function alterarSet(setId, valor) {
  const elemento = document.getElementById(setId);
  let atual = parseInt(elemento.innerText);
  atual = Math.max(0, atual + valor);
  elemento.innerText = atual;
}

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

function girarTela() {
  const body = document.body;
  if (body.classList.contains('girado')) {
    body.classList.remove('girado');
  } else {
    body.classList.add('girado');
  }
}

// Atualizar data e hora
function atualizarDataHora() {
  const dataHora = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour12: false
  });
  document.getElementById('dataHora').textContent = dataHora;
}

setInterval(atualizarDataHora, 1000);
window.onload = atualizarDataHora;
