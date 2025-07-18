document.addEventListener("DOMContentLoaded", function () {
    fetch("js/galeria.json")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("galeria");
            data.albuns.forEach((album, index) => {
                const capaIndex = (index % 4); // alterna entre 0 a 3
                const capas = ["capa.jpg", "sd1.jpg", "sd2.jpg", "sd3.jpg"];
                const capaSelecionada = capas[capaIndex];
                const albumDiv = document.createElement("div");
                albumDiv.className = "album" + (index === 0 ? " album-destaque" : "");
                albumDiv.innerHTML = `
                    <a href="${album.link}" target="_blank">
                        <img src="imagens/${capaSelecionada}" alt="Capa do Álbum">
                        <strong>${album.titulo}</strong>
                        <p>${album.data}</p>
                    </a>
                `;
                container.appendChild(albumDiv);
            });
        });
});

function verificarSenha() {
    const senhaCorreta = "1829";
    const senhaDigitada = document.getElementById("senha").value;
    if (senhaDigitada === senhaCorreta) {
        document.getElementById("login").style.display = "none";
        document.getElementById("galeria").style.display = "grid";
    } else {
        alert("Senha incorreta.");
    }
}