document.addEventListener("DOMContentLoaded", function () {
    const agendaDiv = document.getElementById("agenda");
    const calendarioInput = document.getElementById("calendario");
    const mesSelect = document.getElementById("mesSelecionado");
    const limparFiltroBtn = document.getElementById("limparFiltro");

    let jogos = [];

    fetch("json/agenda.json")
        .then(response => response.json())
        .then(data => {
            jogos = data.sort((a, b) => {
                const dataA = new Date(a.ano, a.mes - 1, a.dia);
                const dataB = new Date(b.ano, b.mes - 1, b.dia);
                return dataA - dataB;
            });

            mostrarAgendaPadrao();

            calendarioInput.addEventListener("change", function () {
                if (!this.value) return;

                const partes = this.value.split("-");
                const anoSelecionado = Number(partes[0]);
                const mesSelecionado = Number(partes[1]);
                const diaSelecionado = Number(partes[2]);

                const dataSelecionada = new Date(anoSelecionado, mesSelecionado - 1, diaSelecionado);

                const jogosNoDia = jogos.filter(jogo => {
                    const dataJogo = new Date(jogo.ano, jogo.mes - 1, jogo.dia);
                    return dataJogo.toDateString() === dataSelecionada.toDateString();
                });

                exibirJogos(jogosNoDia, false);
            });

            mesSelect.addEventListener("change", function () {
                const mesSelecionado = Number(this.value);
                if (!mesSelecionado) return;

                const jogosDoMes = jogos.filter(jogo => jogo.mes === mesSelecionado);

                exibirJogos(jogosDoMes, false);
            });

            limparFiltroBtn.addEventListener("click", function () {
                calendarioInput.value = "";
                mesSelect.value = "";
                mostrarAgendaPadrao();
            });
        });

    function mostrarAgendaPadrao() {
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

        exibirJogos(jogosExibidos, true);
    }

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

            for (let jogo of jogosParaExibir) {
                const dataJogo = new Date(jogo.ano, jogo.mes - 1, jogo.dia);
                if (dataJogo >= dataHoje) {
                    proximoJogo = jogo;
                    break;
                }
            }
        }

        jogosParaExibir.forEach(jogo => {
            const diaFormatado = String(jogo.dia).padStart(2, '0');
            const mesFormatado = String(jogo.mes).padStart(2, '0');

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