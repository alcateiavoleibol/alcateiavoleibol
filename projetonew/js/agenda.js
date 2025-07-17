document.getElementById('menu-toggle').onclick = function () {
    const menuList = document.getElementById('menu-list');
    menuList.style.display = (menuList.style.display === 'block') ? 'none' : 'block';
};

let isAdmin = false;

function validarAdmin() {
    const senha = document.getElementById('admin-password').value;
    if (senha === '2020') {
        isAdmin = true;
        alert('Acesso administrativo liberado!');
        carregarAgenda();
    } else {
        alert('Senha incorreta.');
    }
}

function carregarAgenda() {
    fetch('agenda.json')
        .then(response => response.json())
        .then(data => renderizarAgenda(data))
        .catch(error => console.error('Erro ao carregar agenda:', error));
}

function renderizarAgenda(jogos) {
    const agendaDiv = document.getElementById('agenda');
    agendaDiv.innerHTML = '';

    jogos.sort((a, b) => new Date(a.data) - new Date(b.data));

    jogos.forEach((jogo, index) => {
        const divJogo = document.createElement('div');
        divJogo.className = 'jogo';

        divJogo.innerHTML = `
            <h2>Jogo ${index + 1}</h2>
            <p><strong>Data:</strong> ${jogo.data}</p>
            <p><strong>Horário:</strong> ${jogo.hora_inicio}h${jogo.minuto_inicio}m até ${jogo.hora_fim}h${jogo.minuto_fim}m</p>
            <p><strong>Taxa de Aluguel:</strong> R$ ${jogo.taxa}</p>
            <p><strong>Local:</strong> ${jogo.local}</p>
            <p><strong>Endereço:</strong> ${jogo.endereco}</p>
        `;

        if (isAdmin) {
            divJogo.innerHTML += `
                <button class="admin-btn" onclick="editarJogo(${index})">Editar</button>
                <button class="admin-btn" onclick="excluirJogo(${index})">Excluir</button>
            `;
        }

        agendaDiv.appendChild(divJogo);
    });
}

function editarJogo(index) {
    alert('Função de edição a ser implementada para o jogo ' + (index + 1));
    // Você pode expandir para um editor real se desejar.
}

function excluirJogo(index) {
    if (confirm('Deseja realmente excluir este jogo?')) {
        fetch('agenda.json')
            .then(response => response.json())
            .then(jogos => {
                jogos.splice(index, 1);
                salvarAgenda(jogos);
            });
    }
}

function salvarAgenda(jogos) {
    alert('Alterações precisam ser feitas manualmente no arquivo agenda.json no ambiente de hospedagem.');
    // Em ambiente estático não é possível salvar via JS puro.
}

carregarAgenda();
