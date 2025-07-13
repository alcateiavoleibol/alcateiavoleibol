
const URL_JSON = "https://raw.githubusercontent.com/alcateiavoleibol/agenda/main/jogos.json";
const GITHUB_API = "https://api.github.com/repos/alcateiavoleibol/agenda/contents/jogos.json";
const senhaCorreta = "alcateia123";

let jogos = [];

document.addEventListener("DOMContentLoaded", async () => {
  await carregarJogos();

  document.getElementById("btn-login").addEventListener("click", () => {
    const senha = document.getElementById("senha").value;
    if (senha === senhaCorreta) {
      document.getElementById("admin-section").classList.remove("hidden");
      document.getElementById("login-section").classList.add("hidden");
      GITHUB_TOKEN = prompt("Cole o token de acesso aqui:");
    } else {
      document.getElementById("login-message").textContent = "Senha incorreta.";
    }
  });

  document.getElementById("form-jogo").addEventListener("submit", async (e) => {
    e.preventDefault();
    const novoJogo = {
      data: document.getElementById("data").value,
      horaInicio: document.getElementById("hora-inicio").value,
      horaTermino: document.getElementById("hora-termino").value,
      local: document.getElementById("local").value
    };
    jogos.push(novoJogo);
    await salvarJogos();
    exibirJogos();
  });
});

async function carregarJogos() {
  const res = await fetch(URL_JSON);
  jogos = await res.json();
  exibirJogos();
}

function exibirJogos() {
  const lista = document.getElementById("lista-jogos");
  if (!lista) return;
  lista.innerHTML = "";
  jogos.sort((a, b) => new Date(a.data) - new Date(b.data));
  jogos.forEach((jogo, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${jogo.data}</strong> - ${jogo.local} (${jogo.horaInicio}h | ${jogo.horaTermino}h)
      </div>
      <div class="acoes">
        <button class="editar" onclick="editarJogo(${index})">Editar</button>
        <button class="excluir" onclick="excluirJogo(${index})">Excluir</button>
      </div>
    `;
    lista.appendChild(li);
  });
}

function editarJogo(index) {
  const j = jogos[index];
  document.getElementById("data").value = j.data;
  document.getElementById("hora-inicio").value = j.horaInicio;
  document.getElementById("hora-termino").value = j.horaTermino;
  document.getElementById("local").value = j.local;
  jogos.splice(index, 1);
}

async function excluirJogo(index) {
  if (confirm("Deseja excluir este jogo?")) {
    jogos.splice(index, 1);
    await salvarJogos();
    exibirJogos();
  }
}

async function salvarJogos() {
  const conteudo = btoa(unescape(encodeURIComponent(JSON.stringify(jogos, null, 2))));
  const res = await fetch(GITHUB_API, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + GITHUB_TOKEN
    },
    body: JSON.stringify({
      message: "Atualização automática da agenda",
      content: conteudo,
      sha: await obterSHA()
    })
  });

  if (res.ok) {
    alert("Jogo salvo com sucesso!");
  } else {
    alert("Erro ao salvar no GitHub.");
  }
}

async function obterSHA() {
  const res = await fetch(GITHUB_API, {
    headers: { "Authorization": "Bearer " + GITHUB_TOKEN }
  });
  const data = await res.json();
  return data.sha;
}
