let jogos = [];

async function carregarJogos() {
    const res = await fetch('agenda.json');
    jogos = await res.json();
    renderizarAgenda();
}

function renderizarAgenda() {
    const agenda = document.getElementById('agenda');
    agenda.innerHTML = '';

    const hoje = new Date();

    jogos.sort((a, b) => new Date(a.data + ' ' + a.horaInicio) - new Date(b.data + ' ' + b.horaInicio));

    jogos.forEach((jogo, index) => {
        const div = document.createElement('div');
        div.classList.add('jogo');

        const dataHora = new Date(jogo.data + 'T' + jogo.horaInicio);

        if (dataHora >= hoje && index === 0) {
            div.classList.add('proximo');
        }

        div.innerHTML = `
            <h3>${jogo.data} às ${jogo.horaInicio}</h3>
            <p><strong>Fim:</strong> ${jogo.horaFim}</p>
            <p><strong>Local:</strong> ${jogo.local}</p>
            <p><strong>Endereço:</strong> ${jogo.endereco}</p>
        `;

        agenda.appendChild(div);
    });
}

function authAdmin() {
    const senha = document.getElementById('adminPassword').value;
    if (senha === '2020') {
        document.getElementById('adminControls').classList.remove('hidden');
        alert('Acesso liberado!');
    } else {
        alert('Senha incorreta!');
    }
}

function addJogo() {
    const data = document.getElementById('dataInput').value;
    const horaInicio = document.getElementById('horaInicioInput').value;
    const horaFim = document.getElementById('horaFimInput').value;
    const local = document.getElementById('localInput').value;
    const endereco = document.getElementById('enderecoInput').value;

    if (data && horaInicio && horaFim && local && endereco) {
        jogos.push({ data, horaInicio, horaFim, local, endereco });
        renderizarAgenda();
        alert('Jogo adicionado (apenas localmente). Atualize o JSON manualmente para permanência.');
    } else {
        alert('Preencha todos os campos.');
    }
}

document.getElementById('adminBtn').addEventListener('click', () => {
    document.getElementById('adminPanel').classList.toggle('hidden');
});

carregarJogos();
