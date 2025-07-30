// Função para carregar os álbuns da galeria a partir do JSON
function carregarGaleria() {
    fetch("json/galeria.json") 
        .then(response => response.json())
        .then(data => {
            const galeria = document.getElementById("galeria");
            data.albuns.forEach(album => {
                const div = document.createElement("div");
                div.classList.add("album");

                div.innerHTML = `
                    <img src="imagens/book/${album.capa}" alt="${album.titulo}">
                    <a href="${album.link}" target="_blank">${album.titulo}</a>
                    <p style="color:#fff;">📅 ${album.data}</p>
                `;

                galeria.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar a galeria:", error);
        });
}

// Função para verificar senha e exibir a galeria
function verificarSenha() {
    const senhaCorreta = "2025"; // SENHA MENSAL
    const senhaDigitada = document.getElementById("senha").value;

    if (senhaDigitada === senhaCorreta) {
        document.getElementById("login").style.display = "none";
        document.getElementById("galeria").style.display = "grid";
        carregarGaleria();
    } else {
        alert("Senha incorreta!");
    }
}