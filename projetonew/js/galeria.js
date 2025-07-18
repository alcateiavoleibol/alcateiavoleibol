document.addEventListener("DOMContentLoaded", function () {
    fetch("js/galeria.json")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("galeria");
            data.albuns.forEach((album, index) => {
                const capa = album.capa || "book.jpg";
                const albumDiv = document.createElement("div");
                albumDiv.className = "album" + (index === 0 ? " album-destaque" : "");
                albumDiv.innerHTML = `
                    <a href="${album.link}" target="_blank">
                        <img src="..book/imagens/book${capa}" alt="Capa do Álbum">
                        <strong>${album.titulo}</strong>
                        <p>${album.data}</p>
                    </a>
                `;
                container.appendChild(albumDiv);
            });
        });
});

function verificarSenha() {
    const senhaCorreta = "2025";
    const senhaDigitada = document.getElementById("senha").value;
    if (senhaDigitada === senhaCorreta) {
        document.getElementById("login").style.display = "none";
        document.getElementById("galeria").style.display = "grid";
    } else {
        alert("Senha incorreta.");
    }
}