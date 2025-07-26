function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios") || "{}");
}

function salvarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function loginUsuario(nome, senha) {
  const usuarios = getUsuarios();
  if (!usuarios[nome]) {
    usuarios[nome] = { senha, ficha: {}, imagem: "DECANE.png" };
  } else if (usuarios[nome].senha !== senha) {
    alert("Senha incorreta!");
    return false;
  }
  localStorage.setItem("usuarioLogado", nome);
  salvarUsuarios(usuarios);
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("username").value;
      const senha = document.getElementById("password").value;
      if (loginUsuario(nome, senha)) {
        window.location.href = "painel.html";
      }
    });
  } else {
    carregarFicha();
    carregarAmigos();
  }
});

function carregarFicha() {
  const nome = localStorage.getItem("usuarioLogado");
  if (!nome) return location.href = "index.html";
  const usuarios = getUsuarios();
  const user = usuarios[nome];
  document.getElementById("boasVindas").innerText = "Olá, " + nome;
  document.getElementById("personagemImg").src = "imagens/personagens/" + (user.imagem || "DECANE.png");
  const campos = ["birth", "char", "nome", "classe", "despertar", "power", "level", "tower", "berkas", "vazio", "visual", "atk"];
  campos.forEach(c => {
    document.getElementById(c).value = user.ficha[c] || "";
  });
}

function salvarFicha() {
  const nome = localStorage.getItem("usuarioLogado");
  const usuarios = getUsuarios();
  const user = usuarios[nome];
  const campos = ["birth", "char", "nome", "classe", "despertar", "power", "level", "tower", "berkas", "vazio", "visual", "atk"];
  user.ficha = {};
  campos.forEach(c => {
    user.ficha[c] = document.getElementById(c).value;
  });
  salvarUsuarios(usuarios);
  alert("Ficha salva!");
}

function carregarAmigos() {
  const nome = localStorage.getItem("usuarioLogado");
  const usuarios = getUsuarios();
  const lista = document.getElementById("amigosLista");
  lista.innerHTML = "";
  for (const u in usuarios) {
    if (u !== nome) {
      const li = document.createElement("li");
      li.innerHTML = u + " <button onclick='verAmigo(\"" + u + "\")'>Ver</button>";
      lista.appendChild(li);
    }
  }
}

function verAmigo(nome) {
  const usuarios = getUsuarios();
  const user = usuarios[nome];
  const campos = ["birth", "char", "nome", "classe", "despertar", "power", "level", "tower", "berkas", "vazio", "visual", "atk"];
  document.getElementById("boasVindas").innerText = "Perfil de " + nome;
  document.getElementById("personagemImg").src = "imagens/personagens/" + (user.imagem || "DECANE.png");
  campos.forEach(c => {
    document.getElementById(c).value = user.ficha[c] || "";
    document.getElementById(c).disabled = true;
  });
}
