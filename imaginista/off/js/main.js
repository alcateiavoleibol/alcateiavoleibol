// Utilitários
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Banners animados no topo
(function bannerAnimation() {
  const banners = $$('.top-banner img');
  let index = 0;
  setInterval(() => {
    banners.forEach((img, i) => {
      img.style.opacity = i === index ? '1' : '0.5';
      img.style.transform = i === index ? 'scale(1.1)' : 'scale(1)';
    });
    index = (index + 1) % banners.length;
  }, 3000);
})();

// Carrossel automático vertical
(function carouselAuto() {
  const items = $$('.carousel-item');
  if (!items.length) return;
  let current = 0;
  setInterval(() => {
    items.forEach((el, i) => el.classList.toggle('active', i === current));
    current = (current + 1) % items.length;
  }, 4000);
})();

// Slogan explosivo
(function sloganExplode() {
  const slogan = $('#slogan');
  if (!slogan) return;
  slogan.addEventListener('click', () => {
    const words = slogan.querySelectorAll('.slogan-word');
    words.forEach(word => {
      const tx = `${(Math.random() - 0.5) * 200}px`;
      const ty = `${(Math.random() - 0.5) * 200}px`;
      word.style.setProperty('--tx', tx);
      word.style.setProperty('--ty', ty);
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
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu   = document.querySelector('.main-menu');
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

  toggle.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
  });

  themeBtn?.addEventListener('click', () => {
    const html = document.documentElement;
    const atual= html.getAttribute('data-theme');
    html.setAttribute('data-theme', atual === 'dark' ? 'light' : 'dark');
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

  // Autoplay para desktop
  window.addEventListener('load', () => {
    if (!/Mobi|Android/i.test(navigator.userAgent)) {
      audio.play().catch(() => {});
    }
  });
})();