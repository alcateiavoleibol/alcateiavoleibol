document.addEventListener("DOMContentLoaded", function () {
    const agendaDiv = document.getElementById("agenda");
    const calendarioInput = document.getElementById("calendario");

    fetch("json/agenda.json")
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

            // Formatando dia e mês com dois dígitos
            const diaFormatado = jogo.dia.toString().padStart(2, '0');
            const mesFormatado = jogo.mes.toString().padStart(2, '0');

            jogoDiv.innerHTML = `
                <h2>${jogo.local}</h2>
                <p><em>${jogo.observacao}</em></p> <!-- Observação abaixo do local -->
                <p><strong>Data:</strong> ${diaFormatado}/${mesFormatado}/${jogo.ano}</p>
                <p><strong>Horário:</strong> ${jogo.hora_inicio}:${jogo.minuto_inicio} às ${jogo.hora_fim}:${jogo.minuto_fim}</p>
                <p><strong>Taxa:</strong> R$ ${jogo.taxa}</p>
                <p><strong>Endereço:</strong> ${jogo.endereco}</p>
            `;
            agendaDiv.appendChild(jogoDiv);
        });
    }
});
