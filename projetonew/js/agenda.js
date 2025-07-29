document.addEventListener("DOMContentLoaded", function () {
    const agendaDiv = document.getElementById("agenda");
    const calendarioInput = document.getElementById("calendario");

    fetch("../json/agenda.json") /*ALTEREI O CAMINHO PARA TESTE */
        .then(response => response.json())
        .then(jogos => {
            exibirJogos(jogos);

            if (calendarioInput) {
                calendarioInput.addEventListener("change", function () {
                    if (!this.value) {
                        exibirJogos(jogos); // Mostrar todos os jogos se o campo for limpo
                        return;
                    }

                    const partes = this.value.split("-");
                    const dataSelecionada = new Date(
                        Number(partes[0]),
                        Number(partes[1]) - 1,
                        Number(partes[2])
                    );

                    const jogosFiltrados = jogos.filter(jogo => {
                        const dataJogo = new Date(jogo.ano, jogo.mes - 1, jogo.dia);
                        return dataJogo.toDateString() === dataSelecionada.toDateString();
                    });

                    exibirJogos(jogosFiltrados);
                });
            }
        });

    function exibirJogos(jogosParaExibir) {
        agendaDiv.innerHTML = "";
        if (jogosParaExibir.length === 0) {
            agendaDiv.innerHTML = "<p>Nenhum jogo encontrado para a data selecionada.</p>";
            return;
        }

        jogosParaExibir.forEach(jogo => {
            const jogoDiv = document.createElement("div");
            jogoDiv.className = "jogo";
            jogoDiv.innerHTML = `
                <h2>${jogo.local}</h2>
                <p><strong>Data:</strong> ${jogo.dia}/${jogo.mes}/${jogo.ano}</p>
                <p><strong>Horário:</strong> ${jogo.hora_inicio}:${jogo.minuto_inicio} às ${jogo.hora_fim}:${jogo.minuto_fim}</p>
                <p><strong>Taxa:</strong> R$ ${jogo.taxa}</p>
                <p><strong>Endereço:</strong> ${jogo.endereco}</p>
            `;
            agendaDiv.appendChild(jogoDiv);
        });
    }
});
