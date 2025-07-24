document.addEventListener('DOMContentLoaded', () => {

    function formatarDataBrasilia(dataISO) {
        const data = new Date(dataISO + 'T00:00:00-03:00'); // Força horário de Brasília
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    fetch('js/bday.json')
        .then(response => response.json())
        .then(data => {
            const carousel = document.getElementById('birthday-carousel');
            const currentMonth = new Date().getMonth() + 1; // Janeiro = 0
            const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

            let aniversariantesDoMes = data.filter(pessoa => {
                const dataAniversario = new Date(pessoa.data + 'T00:00:00-03:00');
                return dataAniversario.getMonth() + 1 === currentMonth;
            });

            aniversariantesDoMes.sort((a, b) => new Date(a.data) - new Date(b.data));

            let proximoAniversarianteIndex = aniversariantesDoMes.findIndex(pessoa => {
                const aniversarioData = new Date(pessoa.data + 'T00:00:00-03:00');
                return aniversarioData >= today;
            });
            if (proximoAniversarianteIndex === -1) proximoAniversarianteIndex = 0;

            const montarCard = (pessoa, isDestaque) => `
                <div class="birthday-card ${isDestaque ? 'highlight' : ''}">
                    <img src="imagens/bolo.png" alt="Bolo">
                    <p>${pessoa.nome}<br><span>${formatarDataBrasilia(pessoa.data)}</span></p>
                </div>
            `;

            aniversariantesDoMes.forEach((pessoa, index) => {
                carousel.innerHTML += montarCard(pessoa, index === proximoAniversarianteIndex);
            });

            // Duplicação para efeito de loop infinito no carrossel
            aniversariantesDoMes.forEach((pessoa, index) => {
                carousel.innerHTML += montarCard(pessoa, index === proximoAniversarianteIndex);
            });
        });
});
