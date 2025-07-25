document.addEventListener('DOMContentLoaded', () => {

    function formatarDataBrasilia(dataISO) {
        const data = new Date(dataISO + 'T00:00:00-03:00'); // Horário de Brasília
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    const carousel = document.getElementById('birthday-carousel');
    // Data atual no fuso de São Paulo
    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

    // Atualiza o array birthdays para adicionar info se é hoje e compara só mês e dia no ano atual
    const aniversariantesAtualizados = birthdays.map(pessoa => {
        const originalDate = new Date(pessoa.data + 'T00:00:00-03:00');
        const aniversarioEsteAno = new Date(today.getFullYear(), originalDate.getMonth(), originalDate.getDate());

        return {
            ...pessoa,
            aniversarioHoje: aniversarioEsteAno.getDate() === today.getDate() && aniversarioEsteAno.getMonth() === today.getMonth(),
            aniversarioComparado: aniversarioEsteAno
        };
    });

    // Ordena pelo aniversário no ano atual
    aniversariantesAtualizados.sort((a, b) => a.aniversarioComparado - b.aniversarioComparado);

    // Filtra quem faz aniversário hoje
    const aniversariantesHoje = aniversariantesAtualizados.filter(p => p.aniversarioHoje);

    // Se ninguém faz aniversário hoje, pega o próximo da lista (data maior ou igual a hoje)
    let proximoAniversariante = null;
    if (aniversariantesHoje.length === 0) {
        proximoAniversariante = aniversariantesAtualizados.find(p => p.aniversarioComparado >= today);
        if (!proximoAniversariante) {
            // Se não achar (final do ano), pega o primeiro do próximo ano
            proximoAniversariante = aniversariantesAtualizados[0];
        }
    }

    // Função para montar o cartão do aniversariante
    const montarCard = (pessoa, isDestaque, isHoje) => `
        <div class="birthday-card ${isDestaque ? 'highlight' : ''}">
            <img src="imagens/gif/bolo.gif" alt="Bolo">
            <p>${pessoa.nome}<br>
            <span>${formatarDataBrasilia(pessoa.data)}${isHoje ? ' (HOJE 🎉)' : ''}</span></p>
        </div>
    `;

    // Exibe no carrossel aniversariantes de hoje (todos) ou o próximo da lista
    if (aniversariantesHoje.length > 0) {
        aniversariantesHoje.forEach(p => {
            carousel.innerHTML += montarCard(p, true, true);
        });
        // Duplicar para efeito carrossel contínuo
        aniversariantesHoje.forEach(p => {
            carousel.innerHTML += montarCard(p, true, true);
        });
    } else {
        carousel.innerHTML += montarCard(proximoAniversariante, true, false);
        carousel.innerHTML += montarCard(proximoAniversariante, true, false); // duplicado para carrossel
    }
});
