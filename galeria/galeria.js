function verificarSenha() {
  const senha = document.getElementById("senha").value;
  if (senha === "2025") {
    document.getElementById("login").style.display = "none";
    document.getElementById("galeria").style.display = "grid";
    carregarGaleria();
  } else {
    alert("Senha incorreta!");
  }
}

function carregarGaleria() {
  fetch("galeria.json")
    .then(response => response.json())
    .then(data => {
      const galeria = document.getElementById("galeria");
      data.albuns.forEach(album => {
        const div = document.createElement("div");
        div.className = "album";
        div.innerHTML = `<h3>${album.data}</h3><a href="${album.link}" target="_blank">${album.titulo}</a>`;
        galeria.appendChild(div);
      });
    });
}
