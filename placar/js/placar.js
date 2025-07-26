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
    elem.requestFullscreen().catch((err) => {
      alert(`Erro ao entrar em tela cheia: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

function girarTela() {
  document.body.classList.toggle('girado');
}

function atualizarDataHora() {
  try {
    const agora = new Date();
    const utc = agora.getTime() + (agora.getTimezoneOffset() * 60000);
    const brasilia = new Date(utc - 3 * 3600000);
    const dataHora = brasilia.toLocaleDateString('pt-BR') + ' ' + brasilia.toLocaleTimeString('pt-BR', { hour12: false });
    document.getElementById('dataHora').textContent = dataHora;
  } catch (e) {
    console.error("Erro ao atualizar data/hora:", e);
    document.getElementById('dataHora').textContent = "Erro no horário";
  }
}

setInterval(atualizarDataHora, 1000);

window.onload = () => {
  try {
    atualizarDataHora();
    carregarEstado();
    aplicarToquePonto('pontos1', 'time1');
    aplicarToquePonto('pontos2', 'time2');
  } catch (e) {
    console.error("Erro ao carregar placar:", e);
  }
};

// Toque longo: pressiona 1s para remover ponto
function aplicarToquePonto(idElemento, time) {
  const el = document.getElementById(idElemento);
  let timer;

  el.addEventListener('mousedown', () => {
    timer = setTimeout(() => {
      alterarPonto(time, -1);
    }, 1000); // 1 segundo
  });

  el.addEventListener('mouseup', () => clearTimeout(timer));
  el.addEventListener('mouseleave', () => clearTimeout(timer));
  el.addEventListener('touchstart', () => {
    timer = setTimeout(() => {
      alterarPonto(time, -1);
    }, 1000);
  });
  el.addEventListener('touchend', () => clearTimeout(timer));
}

function salvarEstado() {
  try {
    const estado = {
      tempo,
      pontos1: document.getElementById('pontos1').textContent,
      pontos2: document.getElementById('pontos2').textContent,
      set1: document.getElementById('set1').textContent,
      set2: document.getElementById('set2').textContent,
      cronometro: document.getElementById('cronometro').textContent
    };
    localStorage.setItem('placarEstado', JSON.stringify(estado));
  } catch (e) {
    console.warn("Erro ao salvar estado:", e);
  }
}

function carregarEstado() {
  try {
    const estado = JSON.parse(localStorage.getItem('placarEstado'));
    if (estado) {
      tempo = estado.tempo;
      document.getElementById('pontos1').textContent = estado.pontos1;
      document.getElementById('pontos2').textContent = estado.pontos2;
      document.getElementById('set1').textContent = estado.set1;
      document.getElementById('set2').textContent = estado.set2;
      document.getElementById('cronometro').textContent = estado.cronometro;
    }
  } catch (e) {
    console.warn("Erro ao carregar estado:", e);
  }
}
