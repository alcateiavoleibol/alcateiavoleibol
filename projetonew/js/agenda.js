document.addEventListener("DOMContentLoaded", function () {
    const agendaDiv = document.getElementById("agenda");
    const calendarioInput = document.getElementById("calendario");

    fetch("json/agenda.json")
        .then(response => response.json())
        .then(jogos => {
            // Ordenar jogos por ano, mês e dia
            jogos.sort((a, b) => {
                const dataA = new Date(a.ano, a.mes - 1, a.dia);
                const dataB = new Date(b.ano, b.mes - 1, b.dia);
                return dataA - dataB;
            });

            const hoje = new Date();
            const mesAtual = hoje.getMonth() + 1;
            const anoAtual = hoje.getFullYear();

            // Filtrar jogos do mês atual
            const jogosMesAtual = jogos.filter(jogo => jogo.mes === mesAtual && jogo.ano === anoAtual);

            exibirJogos(jogosMesAtual);

            if (calendarioInput) {
                calendarioInput.addEventListener("change", function () {
                    if (!this.value) {
                        exibirJogos(jogosMesAtual); // Voltar a exibir jogos do mês atual
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

        const hoje = new Date();
        const hojeString = hoje.toDateString();
        let jogoDoDia = null;

        jogosParaExibir.forEach(jogo => {
            const dataJogo = new Date(jogo.ano, jogo.mes - 1, jogo.dia);
            const dataJogoString = dataJogo.toDateString();

            const jogoDiv = document.createElement("div");
            jogoDiv.className = "jogo";

            // Formatando dia e mês com dois dígitos
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

            if (dataJogoString === hojeString) {
                jogoDiv.classList.add("destaque"); // Adiciona destaque ao jogo do dia
                jogoDoDia = jogoDiv; // Armazena para exibir no topo depois
            } else {
                agendaDiv.appendChild(jogoDiv);
            }
        });

        // Se existir jogo do dia, coloca no topo
        if (jogoDoDia) {
            agendaDiv.prepend(jogoDoDia);
        }
    }
});
