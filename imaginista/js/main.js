// Utilitários
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Banners animados no topo (OTIMIZADO)
(function bannerAnimation() {
  const banners = $$('.top-banner img');
  if (banners.length === 0) return;
  
  let index = 0;

  function updateBanner() {
    banners.forEach((img, i) => {
      // Alterna a classe .is-active
      img.classList.toggle('is-active', i === index);
    });
    index = (index + 1) % banners.length;
  }

  updateBanner(); // Roda a primeira vez
  setInterval(updateBanner, 3000); // Continua o ciclo
})();

// Carrossel com paginação manual + automática
(function carouselAuto() {
  const items = $$('.carousel-item');
  const pagination = document.querySelector('.carousel-pagination');
  if (!items.length || !pagination) return;

  // cria bolinhas
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

  // autoplay
  let interval = setInterval(() => {
    current = (current + 1) % items.length;
    update();
  }, 4000);

  // clique nas bolinhas
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

// Mascote animado ao clique
(function mascotAnimate() {
  const mascot = $('#mascot');
  if (!mascot) return;
  mascot.addEventListener('click', () => {
    mascot.classList.add('animate');
    setTimeout(() => mascot.classList.remove('animate'), 800);
  });
})();

// mobile menu toggle
(function mobileMenuToggle() {
  const toggle = $('.mobile-menu-toggle');
  const menu   = $('.main-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
})();

// Painel flutuante: toggle sempre visível + controls condicionais
(function floatPanelControls() {
  const panel   = $('.float-panel');
  const toggle  = $('.panel-toggle');
  const themeBtn= $('.theme-toggle');
  const playBtn = $('#play-pause');
  const volUp   = $('#vol-up');
  const volDown = $('#vol-down');
  const audio   = $('#bg-music');

  if (!panel || !toggle || !audio) return;

  toggle.addEventListener('click', () => panel.classList.toggle('collapsed'));

  themeBtn?.addEventListener('click', () => {
    const html = document.documentElement;
    html.setAttribute('data-theme', html.getAttribute('data-theme')==='dark'?'light':'dark');
  });

  playBtn?.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '⏸️';
    } else {
      audio.pause();
      playBtn.textContent = '▶️';
    }
  });

  volUp?.addEventListener('click', () => {
    audio.volume = Math.min(1, audio.volume + 0.1);
  });
  volDown?.addEventListener('click', () => {
    audio.volume = Math.max(0, audio.volume - 0.1);
  });

  // CORREÇÃO: Lógica de Autoplay robusta (Desktop e Mobile)
  window.addEventListener('load', () => {
    // Tenta tocar a música assim que a página carrega
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Autoplay funcionou! (Provavelmente um Desktop)
          // Sincroniza o botão para mostrar 'Pause'
          playBtn.textContent = '⏸️';
        })
        .catch((error) => {
          // Autoplay foi bloqueado pelo navegador (Provavelmente um Mobile)
          // Garante que o botão mostre 'Play'
          playBtn.textContent = '▶️';
          // O usuário terá que clicar no play para iniciar a música
        });
    }
  });
})();