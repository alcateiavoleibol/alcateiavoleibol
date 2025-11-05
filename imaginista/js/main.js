// Utilitários
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Banners animados no topo
(function bannerAnimation() {
  const banners = $$('.top-banner img');
  if (!banners.length) return; 
  
  let index = 0;
  function updateBanner() {
    banners.forEach((img, i) => {
      img.classList.toggle('is-active', i === index);
    });
    index = (index + 1) % banners.length;
  }
  updateBanner();
  setInterval(updateBanner, 3000);
})();

// Carrossel com paginação manual + automática
(function carouselAuto() {
  const items = $$('.carousel-item');
  const pagination = $('.carousel-pagination');
  if (!items.length || !pagination) return; 

  pagination.innerHTML = ''; 
  
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.dataset.index = i;
    pagination.append(dot);
  });

  let current = 0;
  const dots = Array.from(pagination.children);

  function update() {
    items.forEach((img, i) => img.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  let interval = setInterval(() => {
    current = (current + 1) % items.length;
    update();
  }, 4000);

  pagination.addEventListener('click', e => {
    if (!e.target.classList.contains('dot')) return;
    clearInterval(interval);
    current = Number(e.target.dataset.index);
    update();
    interval = setInterval(() => {
      current = (current + 1) % items.length;
      update();
    }, 4000);
  });
})();

// Slogan explosivo
(function sloganExplode() {
  const slogan = $('#slogan');
  if (!slogan) return; 
  slogan.addEventListener('click', () => {
    const words = slogan.querySelectorAll('.slogan-word');
    words.forEach(word => {
      word.style.setProperty('--tx', `${(Math.random()-0.5)*200}px`);
      word.style.setProperty('--ty', `${(Math.random()-0.5)*200}px`);
    });
    slogan.classList.add('explode');
    setTimeout(() => {
      slogan.classList.remove('explode');
      words.forEach(w => {
        w.style.removeProperty('--tx');
        w.style.removeProperty('--ty');
      });
    }, 1200);
  });
})();

// Mascote animado AO CLIQUE E ABRINDO MENU
(function mascotAnimate() {
  const mascot = $('#mascot');
  const menu   = $('.main-menu'); 
  if (!mascot || !menu) return; 

  mascot.addEventListener('click', () => {
    mascot.classList.add('animate');
    setTimeout(() => mascot.classList.remove('animate'), 800);
    menu.classList.toggle('open'); 
  });
})();


/* Controles de Áudio, Tema e Partículas.
*/
window.addEventListener('load', () => {
  // Seleciona os controlos (agora existem em todas as páginas)
  const themeBtn= $('.desktop-controls .theme-toggle');
  const playBtn = $('.desktop-controls #play-pause');
  const volUp   = $('.desktop-controls #vol-up');
  const volDown = $('.desktop-controls #vol-down');
  const audio   = $('#bg-music');
  const html = document.documentElement;

  // --- 1. Lógica de Áudio (Simplificada) ---
  
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '⏸️';
    } else {
      audio.pause();
      playBtn.textContent = '▶️';
    }
  });

  volUp.addEventListener('click', () => {
    audio.volume = Math.min(1, audio.volume + 0.1);
  });
  
  volDown.addEventListener('click', () => {
    audio.volume = Math.max(0, audio.volume - 0.1);
  });

  // Autoplay do Áudio
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        if (playBtn) playBtn.textContent = '⏸️';
      })
      .catch((error) => {
        if (playBtn) playBtn.textContent = '▶️';
      });
  }
  
  // --- 2. Lógica de Tema ---
  // (Lógica de partículas removida daqui)
  
  themeBtn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
  });
  
}); // Fim do window.addEventListener('load')