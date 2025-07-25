document.addEventListener('DOMContentLoaded', () => {

    function formatarDataBrasilia(dataISO) {
        const data = new Date(dataISO + 'T00:00:00-03:00'); // Horário de Brasília
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    fetch('js/bday.json')
        .then(response => response.json())
        .then(data => {
            const carousel = document.getElementById('birthday-carousel');
            const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

            // Adiciona ano atual às datas para comparar corretamente
            const aniversariantesAtualizados = data.map(pessoa => {
                const originalDate = new Date(pessoa.data + 'T00:00:00-03:00');
                const aniversarioEsteAno = new Date(today.getFullYear(), originalDate.getMonth(), originalDate.getDate());
                return {
                    ...pessoa,
                    aniversarioHoje: aniversarioEsteAno.getDate() === today.getDate() && aniversarioEsteAno.getMonth() === today.getMonth(),
                    aniversarioComparado: aniversarioEsteAno
                };
            });

            // Ordena por data do ano (não considera o ano de nascimento)
            aniversariantesAtualizados.sort((a, b) => a.aniversarioComparado - b.aniversarioComparado);

            const aniversariantesHoje = aniversariantesAtualizados.filter(p => p.aniversarioHoje);

            let proximoAniversariante = null;

            if (aniversariantesHoje.length === 0) {
                proximoAniversariante = aniversariantesAtualizados.find(p => p.aniversarioComparado >= today);
                if (!proximoAniversariante) {
                    // Se acabou o ano, pega o primeiro do próximo ano
                    proximoAniversariante = aniversariantesAtualizados[0];
                }
            }

            const montarCard = (pessoa, isDestaque, isHoje) => `
                <div class="birthday-card ${isDestaque ? 'highlight' : ''}">
                    <img src="imagens/gif/bolo.gif" alt="Bolo">
                    <p>${pessoa.nome}<br>
                    <span>${formatarDataBrasilia(pessoa.data)}${isHoje ? ' (HOJE 🎉)' : ''}</span></p>
                </div>
            `;

            // Exibe aniversariantes de hoje ou o próximo
            if (aniversariantesHoje.length > 0) {
                aniversariantesHoje.forEach(p => {
                    carousel.innerHTML += montarCard(p, true, true);
                });
                // duplicar para o efeito do carrossel
                aniversariantesHoje.forEach(p => {
                    carousel.innerHTML += montarCard(p, true, true);
                });
            } else {
                carousel.innerHTML += montarCard(proximoAniversariante, true, false);
                carousel.innerHTML += montarCard(proximoAniversariante, true, false); // duplicado
            }
        });
});
