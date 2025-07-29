document.addEventListener("DOMContentLoaded", function () {
    const agendaDiv = document.getElementById("agenda");
    const calendarioInput = document.getElementById("calendario");

    fetch("json/agenda.json")
        .then(response => response.json())
        .then(jogos => {
            // Ordenar jogos por data
            jogos.sort((a, b) => {
                const dataA = new Date(a.ano, a.mes - 1, a.dia);
                const dataB = new Date(b.ano, b.mes - 1, b.dia);
                return dataA - dataB;
            });

            const hoje = new Date();
            const mesAtual = hoje.getMonth() + 1;
            const anoAtual = hoje.getFullYear();

            // Filtrar jogos do mês atual
            let jogosExibidos = jogos.filter(jogo => jogo.mes === mesAtual && jogo.ano === anoAtual);

            // Se não houver jogos no mês atual, buscar os 3 próximos jogos futuros
            if (jogosExibidos.length === 0) {
                const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                const proximosJogos = jogos.filter(jogo => {
                    const dataJogo = new Date(jogo.ano, jogo.mes - 1, jogo.dia);
                    return dataJogo >= dataHoje;
                }).slice(0, 3);

                jogosExibidos = proximosJogos;
            }

            exibirJogos(jogosExibidos);

            if (calendarioInput) {
                calendarioInput.addEventListener("change", function () {
                    if (!this.value) {
                        exibirJogos(jogosExibidos);
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
            agendaDiv.innerHTML = "<p>Nenhum jogo encontrado.</p>";
            return;
        }

        const hoje = new Date();
        const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

        // Encontrar o próximo jogo futuro (ou de hoje)
        let proximoJogo = null;
        for (let jogo of jogosParaExibir) {
            const dataJogo = new Date(jogo.ano, jogo.mes - 1, jogo.dia);
            if (dataJogo >= dataHoje) {
                proximoJogo = jogo;
                break;
            }
        }

        jogosParaExibir.forEach(jogo => {
            const dataJogo = new Date(jogo.ano, jogo.mes - 1, jogo.dia);

            const jogoDiv = document.createElement("div");
            jogoDiv.className = "jogo";

            const diaFormatado = jogo.dia.toString().padStart(2, '0');
            const mesFormatado = jogo.mes.toString().padStart(2, '0');

            jogoDiv.innerHTML = `
                <h2>${jogo.local}</h2>
                <p><em>${jogo.observacao}</em></p>
                <p><strong>Data:</strong> ${diaFormatado}/${mesFormatado}/${jogo.ano}</p>
                <p><strong>Horário:</strong> ${jogo.hora_inicio}:${jogo.minuto_inicio} às ${jogo.hora_fim}:${jogo.minuto_fim}</p>
                <p><strong>Taxa:</strong> R$ ${jogo.taxa}</p>
                <p><strong>Endereço:</strong> ${jogo.endereco}</p>
            `;

            // Se for o próximo jogo, destacar
            if (proximoJogo && jogo === proximoJogo) {
                jogoDiv.classList.add("destaque");
            }

            agendaDiv.appendChild(jogoDiv);
        });
    }
});
