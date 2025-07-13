
const URL_JSON = "https://raw.githubusercontent.com/alcateiavoleibol/agenda/main/jogos.json";

async function carregarProximosJogos() {
  try {
    const res = await fetch(URL_JSON);
    const jogos = await res.json();

    const hoje = new Date();
    const jogosFuturos = jogos
      .filter(j => new Date(j.data + 'T' + j.horaInicio) >= hoje)
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .slice(0, 4);

    const container = document.getElementById("proximos-jogos");
    container.innerHTML = "";

    jogosFuturos.forEach(jogo => {
      const card = document.createElement("div");
      card.className = "jogo-card";
      card.innerHTML = `
        <div class="data-jogo">${jogo.data}</div>
        <div class="horario-jogo">${jogo.local} - ${jogo.horaInicio}h | ${jogo.horaTermino}h</div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar jogos:", err);
  }
}

document.addEventListener("DOMContentLoaded", carregarProximosJogos);
