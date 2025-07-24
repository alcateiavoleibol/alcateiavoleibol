document.addEventListener('DOMContentLoaded', () => {
    fetch('js/bday.json')
        .then(response => response.json())
        .then(data => {
            const carousel = document.getElementById('birthday-carousel');
            const currentMonth = new Date().getMonth() + 1; // Janeiro = 0
            const today = new Date();

            // Filtra aniversariantes do mês atual
            let aniversariantesDoMes = data.filter(pessoa => {
                const dataAniversario = new Date(pessoa.data);
                return dataAniversario.getMonth() + 1 === currentMonth;
            });

            // Ordena pela data
            aniversariantesDoMes.sort((a, b) => new Date(a.data) - new Date(b.data));

            // Destaca o próximo aniversariante
            let proximoAniversarianteIndex = aniversariantesDoMes.findIndex(pessoa => {
                return new Date(pessoa.data) >= today;
            });
            if (proximoAniversarianteIndex === -1) proximoAniversarianteIndex = 0;

            // Monta os cards no carrossel (duplicados para loop)
            const montarCard = (pessoa, isDestaque) => `
                <div class="birthday-card ${isDestaque ? 'highlight' : ''}">
                    <img src="imagens/bolo.png" alt="Bolo">
                    <p>${pessoa.nome}<br><span>${new Date(pessoa.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span></p>
                </div>
            `;

            aniversariantesDoMes.forEach((pessoa, index) => {
                carousel.innerHTML += montarCard(pessoa, index === proximoAniversarianteIndex);
            });

            // DUPLICA para efeito de loop infinito
            aniversariantesDoMes.forEach((pessoa, index) => {
                carousel.innerHTML += montarCard(pessoa, index === proximoAniversarianteIndex);
            });
        });
});
