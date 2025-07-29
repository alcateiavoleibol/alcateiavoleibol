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

            let jogosExibidos = jogos.filter(jogo => jogo.mes === mesAtual && jogo.ano === anoAtual);

            if (jogosExibidos.length === 0) {
                const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                const proximosJogos = jogos.filter(jogo => {
                    const dataJogo = new Date(jogo.ano, jogo.mes - 1, jogo.dia);
                    return dataJogo >= dataHoje;
                }).slice(0, 3);

                jogosExibidos = proximosJogos;
            }

            exibirJogos(jogosExibidos, true); // Destaque habilitado na carga inicial

            if (calendarioInput) {
                calendarioInput.addEventListener("change", function () {
                    if (!this.value) {
                        exibirJogos(jogosExibidos, true); // Voltar a exibir jogos do mês atual com destaque
                        return;
                    }

                    const partes = this.value.split("-");
                    const anoSelecionado = Number(partes[0]);
                    const mesSelecionado = Number(partes[1]);
                    const diaSelecionado = Number(partes[2]);

                    const dataSelecionada = new Date(anoSelecionado, mesSelecionado - 1, diaSelecionado);

                    const jogosNoDia = jogos.filter(jogo => {
                        const dataJogo = new Date(jogo.ano, jogo.mes - 1, jogo.dia);
                        return dataJogo.toDateString() === dataSelecionada.toDateString();
                    });

                    if (jogosNoDia.length > 0) {
                        exibirJogos(jogosNoDia, false); // Exibir apenas o jogo do dia (sem destaque)
                    } else {
                        // Não tem jogo no dia exato? Mostrar todos os jogos do mês selecionado
                        const jogosDoMes = jogos.filter(jogo => jogo.mes === mesSelecionado && jogo.ano === anoSelecionado);
                        exibirJogos(jogosDoMes, false); // Sem destaque
                    }
                });
            }
        });

    function exibirJogos(jogosParaExibir, destacarProximo) {
        agendaDiv.innerHTML = "";

        if (jogosParaExibir.length === 0) {
            agendaDiv.innerHTML = "<p>Nenhum jogo encontrado.</p>";
            return;
        }

        let proximoJogo = null;

        if (destacarProximo) {
            const hoje = new Date();
            const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

            // Encontrar o próximo jogo (hoje ou futuro)
            for (let jogo of jogosParaExibir) {
                const dataJogo = new Date(jogo.ano, jogo.mes - 1, jogo.dia);
                if (dataJogo >= dataHoje) {
                    proximoJogo = jogo;
                    break;
                }
            }
        }

        jogosParaExibir.forEach(jogo => {
            const diaFormatado = jogo.dia.toString().padStart(2, '0');
            const mesFormatado = jogo.mes.toString().padStart(2, '0');

            const jogoDiv = document.createElement("div");
            jogoDiv.className = "jogo";

            jogoDiv.innerHTML = `
                <h2>${jogo.local}</h2>
                <p><em>${jogo.observacao}</em></p>
                <p><strong>Data:</strong> ${diaFormatado}/${mesFormatado}/${jogo.ano}</p>
                <p><strong>Horário:</strong> ${jogo.hora_inicio}:${jogo.minuto_inicio} às ${jogo.hora_fim}:${jogo.minuto_fim}</p>
                <p><strong>Taxa:</strong> R$ ${jogo.taxa}</p>
                <p><strong>Endereço:</strong> ${jogo.endereco}</p>
            `;

            if (destacarProximo && proximoJogo && jogo === proximoJogo) {
                jogoDiv.classList.add("destaque");
            }

            agendaDiv.appendChild(jogoDiv);
        });
    }
});
