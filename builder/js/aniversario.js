document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('birthday-carousel');
  const timezone = 'America/Sao_Paulo';

  // Data atual no fuso horário de São Paulo
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0 a 11
  const currentDay = today.getDate();

  // Função para formatar data no padrão dd/mm/yyyy ou dd/mm
  function formatarDataBrasilia(dataISO, mostrarAno = true) {
    const data = new Date(dataISO + 'T00:00:00-03:00');
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return mostrarAno ? `${dia}/${mes}/${ano}` : `${dia}/${mes}`;
  }

  // Pega só os aniversariantes do mês atual
  const aniversariantesMes = birthdays
    .map(pessoa => {
      const dataAniversario = new Date(pessoa.data + 'T00:00:00-03:00');
      return {
        ...pessoa,
        dia: dataAniversario.getDate(),
        mes: dataAniversario.getMonth(),
        dataAniversarioAtual: new Date(currentYear, dataAniversario.getMonth(), dataAniversario.getDate())
      };
    })
    .filter(p => p.mes === currentMonth)
    .sort((a, b) => a.dia - b.dia);

  if (aniversariantesMes.length === 0) {
    carousel.innerHTML = '<p>Nenhum aniversário neste mês.</p>';
    return;
  }

  // Filtra quem faz aniversário hoje (pode ter mais de um)
  const aniversariantesHoje = aniversariantesMes.filter(p => p.dia === currentDay);

  // Função para montar o card com destaque para aniversariante do dia
  const montarCard = (pessoa, isHoje) => `
    <div class="birthday-card ${isHoje ? 'highlight' : ''}" style="margin-right: 60px;">
      <img src="imagens/gif/bolo.gif" alt="Bolo" />
      <p>
        ${pessoa.nome}<br>
        <span>
          ${formatarDataBrasilia(pessoa.data, pessoa.mostrarAno !== false)} 
          ${isHoje ? `<img src="imagens/gif/festa.gif" alt="Festa" style="width:60px; vertical-align:middle; margin-left:4px;">` : ''}
        </span>
      </p>
    </div>
  `;

  // Monta o html do carrossel destacando aniversariantes do dia
  let html = '';
  aniversariantesMes.forEach(pessoa => {
    const isHoje = pessoa.dia === currentDay;
    html += montarCard(pessoa, isHoje);
  });

  // Duplica os cards para efeito de scroll contínuo, somente se houver mais de 1 aniversariante
  if (aniversariantesMes.length > 1) {
    aniversariantesMes.forEach(pessoa => {
      const isHoje = pessoa.dia === currentDay;
      html += montarCard(pessoa, isHoje);
    });
  }

  carousel.innerHTML = html;

  // --- Animação de scroll horizontal contínuo ---
  let scrollPos = 0;
  const scrollSpeed = 0.5; // ajuste a velocidade do scroll

  function animateScroll() {
    scrollPos += scrollSpeed;
    if (scrollPos >= carousel.scrollWidth / 2) {
      scrollPos = 0;
    }
    carousel.scrollLeft = scrollPos;
    requestAnimationFrame(animateScroll);
  }

  animateScroll();
});
