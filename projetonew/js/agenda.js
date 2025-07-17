function carregarAgenda() {
    fetch('../agenda.json')
        .then(response => response.json())
        .then(data => renderizarAgenda(data))
        .catch(error => console.error('Erro ao carregar agenda:', error));
}

function renderizarAgenda(jogos) {
    const agendaDiv = document.getElementById('agenda');
    agendaDiv.innerHTML = '';

    jogos.sort((a, b) => {
        const dataA = new Date(a.ano, a.mes - 1, a.dia);
        const dataB = new Date(b.ano, b.mes - 1, b.dia);
        return dataA - dataB;
    });

    jogos.forEach((jogo, index) => {
        const divJogo = document.createElement('div');
        divJogo.className = 'jogo';

        if (index === 0) {
            divJogo.classList.add('destaque');
        }

        divJogo.innerHTML = `
            <h2>Jogo ${index + 1}</h2>
            <p><strong>Data:</strong> ${jogo.dia.toString().padStart(2, '0')}/${jogo.mes.toString().padStart(2, '0')}/${jogo.ano}</p>
            <p><strong>Horário:</strong> ${jogo.hora_inicio}h${jogo.minuto_inicio}m até ${jogo.hora_fim}h${jogo.minuto_fim}m</p>
            <p><strong>Taxa de Aluguel:</strong> R$ ${jogo.taxa}</p>
            <p><strong>Local:</strong> ${jogo.local}</p>
            <p><strong>Endereço:</strong> ${jogo.endereco}</p>
        `;

        agendaDiv.appendChild(divJogo);
    });
}

carregarAgenda();
