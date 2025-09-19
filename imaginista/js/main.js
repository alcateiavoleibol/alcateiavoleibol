// INTRO & ÁUDIO
    const intro = document.getElementById('intro-screen');
    const audio = document.getElementById('bg-music');
    window.addEventListener('load', () => {
      audio.volume = 0.5;
      audio.play().catch(() => {});
    });
    intro?.addEventListener('animationend', () => intro.remove());

    // PAINEL FLOUTANTE
    document.querySelector('.panel-toggle')?.addEventListener('click', () => {
      document.querySelector('.float-panel')?.classList.toggle('collapsed');
    });

    // THEME TOGGLE
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      const html = document.documentElement;
      html.setAttribute(
        'data-theme',
        html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
      );
    });

    // MOBILE MENU
    document.querySelector('.mobile-menu-toggle')?.addEventListener('click', () => {
      document.querySelector('nav.menu')?.classList.toggle('open');
    });

    // BANNER SLIDER
    (function() {
      const items = document.querySelectorAll('.banner-slider img');
      let idx = 0;
      setInterval(() => {
        items[idx].classList.remove('active');
        idx = (idx + 1) % items.length;
        items[idx].classList.add('active');
      }, 4000);
    })();

    // CHARACTER BOUNCE
    (function() {
      const char = document.querySelector('.video-char');
      if (!char) return;
      char.addEventListener('click', () => {
        char.classList.remove('animate');
        void char.offsetWidth;
        char.classList.add('animate');
      });
    })();

    // INVITES CAROUSEL
    (function() {
      const slides = document.querySelectorAll('.fade-item');
      const prev   = document.querySelector('.carousel-button.prev');
      const next   = document.querySelector('.carousel-button.next');
      let i = 0;
      const show = x => slides.forEach((s,j) => s.classList.toggle('active', j === x));
      prev.addEventListener('click', () => show(i = (i - 1 + slides.length) % slides.length));
      next.addEventListener('click', () => show(i = (i + 1) % slides.length));
      let auto = setInterval(() => show(i = (i + 1) % slides.length), 3000);
      const cont = document.querySelector('.fade-container');
      cont.addEventListener('mouseenter', () => clearInterval(auto));
      cont.addEventListener('mouseleave', () => auto = setInterval(() => show(i = (i + 1) % slides.length), 3000));
    })();

    // AUDIO CONTROLS
    (function() {
      const btnPlay = document.getElementById('play-pause');
      const btnUp   = document.getElementById('vol-up');
      const btnDown = document.getElementById('vol-down');
      btnPlay.addEventListener('click', () => {
        if (audio.paused) { audio.play(); btnPlay.textContent = '⏸️'; }
        else             { audio.pause(); btnPlay.textContent = '▶️'; }
      });
      btnUp.addEventListener('click', () => audio.volume = Math.min(audio.volume + 0.1, 1));
      btnDown.addEventListener('click', () => audio.volume = Math.max(audio.volume - 0.1, 0));
    })();

    // MASCOT TOGGLE
    (function() {
      const m = document.querySelector('.mascot');
      let v = false;
      m?.addEventListener('click', () => m.classList.toggle('visible', v = !v));
      document.addEventListener('click', e => {
        if (v && !e.target.closest('.mascot')) {
          v = false;
          m.classList.remove('visible');
        }
      });
    })();

    // BLOCK IMG CONTEXT MENU
    document.addEventListener('contextmenu', e => {
      if (e.target.tagName === 'IMG') e.preventDefault();
    });

    // CLOUDS SPAWNER
    function spawnCloud() {
      const c = document.createElement('div');
      c.className = 'cloud';
      const w = 100 + Math.random() * 100;
      c.style.width  = w + 'px';
      c.style.height = (w * 0.6) + 'px';
      c.style.top    = Math.random() * 20 + 'px';
      c.style.animationDuration = 20 + Math.random() * 15 + 's';
      c.addEventListener('click', () => {
        c.remove();
        spawnCloud();
      });
      document.body.append(c);
    }
    for (let i = 0; i < 8; i++) spawnCloud();
    setInterval(spawnCloud, 10000);

    // SLOGAN WORD ANIMATION
    
 document.addEventListener('DOMContentLoaded', () => {
    const sloganEl = document.querySelector('.slogan');
    if (!sloganEl) return;

    // 1) separa texto em spans
    const words = sloganEl.textContent.trim().split(' ');
    sloganEl.innerHTML = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'slogan-word';
      span.textContent = w;
      sloganEl.appendChild(span);
      // adiciona espaço exceto depois do último
      if (i < words.length - 1) sloganEl.appendChild(document.createTextNode(' '));
    });

    // 2) explode + reconstrói em cada click
    sloganEl.addEventListener('click', () => {
      const spans = sloganEl.querySelectorAll('.slogan-word');
      spans.forEach(span => {
        const x = `${(Math.random() - 0.5) * 200}px`;
        const y = `${(Math.random() - 0.5) * 200}px`;
        span.style.setProperty('--tx', x);
        span.style.setProperty('--ty', y);
      });
      sloganEl.classList.add('explode');
      setTimeout(() => {
        sloganEl.classList.remove('explode');
        // opcional: limpa posições customizadas
        spans.forEach(span => {
          span.style.removeProperty('--tx');
          span.style.removeProperty('--ty');
        });
      }, 1200);
    });
  });