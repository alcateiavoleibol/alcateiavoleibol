// Agenda de Jogos com CRUD Local (Simulado)
let jogos = [];

async function carregarJogos() {
    const res = await fetch('agenda.json');
    const data = await res.json();
    if (!localStorage.getItem('agendaJogos')) {
        jogos = data;
        salvarJogos();
    } else {
        jogos = JSON.parse(localStorage.getItem('agendaJogos'));
    }
    renderizarAgenda();
}

function renderizarAgenda() {
    const agenda = document.getElementById('agenda');
    agenda.innerHTML = '';

    const hoje = new Date();

    jogos.sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
    });

    jogos.forEach((jogo, index) => {
        const div = document.createElement('div');
        div.classList.add('jogo');

        const [dia, mes, ano] = jogo.data.split('/');
        const dataHora = new Date(ano, mes - 1, dia);

        if (dataHora >= hoje && index === 0) {
            div.classList.add('proximo');
        }

        div.innerHTML = `
            <h3>${jogo.data} às ${jogo.horaInicio}h</h3>
            <p><strong>Fim:</strong> ${jogo.horaFim}h</p>
            <p><strong>Taxa de Aluguel:</strong> R$ ${jogo.taxa}</p>
            <p><strong>Local:</strong> ${jogo.local}</p>
            <p><strong>Endereço:</strong> ${jogo.endereco}</p>
        `;

        agenda.appendChild(div);
    });

    renderizarAdminJogos();
}

function renderizarAdminJogos() {
    const container = document.getElementById('jogosAdmin');
    if (!container) return;
    container.innerHTML = '';

    jogos.forEach((jogo, index) => {
        const div = document.createElement('div');
        div.classList.add('jogo');
        div.innerHTML = `
            <p><strong>${jogo.data} ${jogo.horaInicio}h</strong> - ${jogo.local}</p>
            <button onclick="editarJogo(${index})">Editar</button>
            <button onclick="excluirJogo(${index})">Excluir</button>
        `;
        container.appendChild(div);
    });

    salvarJogos();
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
    const taxa = document.getElementById('taxaInput').value;
    const local = document.getElementById('localInput').value;
    const endereco = document.getElementById('enderecoInput').value;

    if (data && horaInicio && horaFim && taxa && local && endereco) {
        jogos.push({ data, horaInicio, horaFim, taxa, local, endereco });
        renderizarAgenda();
        alert('Jogo adicionado e salvo automaticamente.');
    } else {
        alert('Preencha todos os campos.');
    }
}

function editarJogo(index) {
    const jogo = jogos[index];
    document.getElementById('dataInput').value = jogo.data;
    document.getElementById('horaInicioInput').value = jogo.horaInicio;
    document.getElementById('horaFimInput').value = jogo.horaFim;
    document.getElementById('taxaInput').value = jogo.taxa;
    document.getElementById('localInput').value = jogo.local;
    document.getElementById('enderecoInput').value = jogo.endereco;
    excluirJogo(index);
}

function excluirJogo(index) {
    if (confirm('Deseja realmente excluir este jogo?')) {
        jogos.splice(index, 1);
        renderizarAgenda();
        alert('Jogo excluído.');
    }
}

function salvarJogos() {
    localStorage.setItem('agendaJogos', JSON.stringify(jogos));
}

async function salvarNoGitHub() {
    if (!confirm('Deseja salvar as alterações no GitHub?')) return;

    // 🔒 Substitua pelo seu token TEMPORÁRIO durante os testes
    const token = "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"; // ← Substitua manualmente

    try {
        const repoOwner = 'alcateiavoleibol';
        const repoName = 'alcateiavoleibol';
        const filePath = 'agenda/agenda.json';
        const branch = 'main';
        const commitMessage = 'Atualização da agenda via painel admin';

        // Obter SHA do arquivo atual
        const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`;
        const getRes = await fetch(getUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!getRes.ok) throw new Error('Falha ao obter arquivo atual');

        const fileData = await getRes.json();
        const sha = fileData.sha;

        // Criar commit
        const content = JSON.stringify(jogos, null, 2);
        const contentBase64 = btoa(unescape(encodeURIComponent(content)));

        const updateUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
        const updateRes = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: commitMessage,
                content: contentBase64,
                sha: sha,
                branch: branch
            })
        });

        if (!updateRes.ok) throw new Error('Falha ao atualizar arquivo');
        alert('✅ Agenda salva no GitHub com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert(`❌ Erro: ${error.message}`);
    }
}

document.getElementById('adminBtn').addEventListener('click', () => {
    document.getElementById('adminPanel').classList.toggle('hidden');
});

carregarJogos();