// INTRO & ÁUDIO
const intro = document.getElementById('intro-screen');
const audio = document.getElementById('bg-music');
window.addEventListener('load', () => {
  if (audio) {
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }
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
  if (!items.length) return;
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
  if (!slides.length) return;
  const prev   = document.querySelector('.carousel-button.prev');
  const next   = document.querySelector('.carousel-button.next');
  let i = 0;
  const show = x => slides.forEach((s,j) => s.classList.toggle('active', j === x));
  if (prev) prev.addEventListener('click', () => show(i = (i - 1 + slides.length) % slides.length));
  if (next) next.addEventListener('click', () => show(i = (i + 1) % slides.length));
  let auto = setInterval(() => show(i = (i + 1) % slides.length), 3000);
  const cont = document.querySelector('.fade-container');
  if (cont) {
    cont.addEventListener('mouseenter', () => clearInterval(auto));
    cont.addEventListener('mouseleave', () => auto = setInterval(() => show(i = (i + 1) % slides.length), 3000));
  }
})();

// AUDIO CONTROLS
(function() {
  if (!audio) return;
  const btnPlay = document.getElementById('play-pause');
  const btnUp   = document.getElementById('vol-up');
  const btnDown = document.getElementById('vol-down');
  if (btnPlay) btnPlay.addEventListener('click', () => {
    if (audio.paused) { audio.play(); btnPlay.textContent = '⏸️'; }
    else             { audio.pause(); btnPlay.textContent = '▶️'; }
  });
  if (btnUp) btnUp.addEventListener('click', () => audio.volume = Math.min(audio.volume + 0.1, 1));
  if (btnDown) btnDown.addEventListener('click', () => audio.volume = Math.max(audio.volume - 0.1, 0));
})();

// MASCOT TOGGLE
(function() {
  const m = document.querySelector('.mascot');
  if (!m) return;
  let v = false;
  m.addEventListener('click', (e) => {
    e.stopPropagation();
    m.classList.toggle('visible', v = !v);
  });
  document.addEventListener('click', e => {
    if (v && !e.target.closest('.mascot')) {
      v = false;
      m.classList.remove('visible');
    }
  });
})();

// BLOCK IMG CONTEXT MENU
document.addEventListener('contextmenu', e => {
  if (e.target && e.target.tagName === 'IMG') e.preventDefault();
});

// CLOUDS SPAWNER (safe + adaptive)
function spawnCloud() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('div');
  c.className = 'cloud';
  const w = 80 + Math.random() * 120;
  c.style.width  = w + 'px';
  c.style.height = (w * 0.6) + 'px';
  c.style.top    = (10 + Math.random() * Math.max(1, window.innerHeight * 0.12)) + 'px';
  c.style.position = 'fixed';
  c.style.left = (window.innerWidth + 10 + Math.random() * 200) + 'px';
  c.style.right = 'auto';
  c.style.animationDuration = (18 + Math.random() * 18) + 's';
  c.addEventListener('click', () => {
    c.remove();
    setTimeout(spawnCloud, 300);
  });
  document.body.append(c);
  setTimeout(() => c.remove(), 60000);
}

(function initClouds() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const initial = isMobile ? 2 : 6;
  const interval = isMobile ? 20000 : 10000;
  for (let i = 0; i < initial; i++) setTimeout(spawnCloud, i * 400);
  const cloudInterval = setInterval(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clearInterval(cloudInterval);
      return;
    }
    spawnCloud();
  }, interval);
})();

// SLOGAN WORD ANIMATION
document.addEventListener('DOMContentLoaded', () => {
  const sloganEl = document.querySelector('.slogan');
  if (!sloganEl) return;
  const words = sloganEl.textContent.trim().split(' ').filter(Boolean);
  sloganEl.innerHTML = '';
  words.forEach((w, i) => {
    const span = document.createElement('span');
    span.className = 'slogan-word';
    span.textContent = w;
    sloganEl.appendChild(span);
    if (i < words.length - 1) sloganEl.appendChild(document.createTextNode(' '));
  });
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
      spans.forEach(span => {
        span.style.removeProperty('--tx');
        span.style.removeProperty('--ty');
      });
    }, 1200);
  });
});

/* RESPONSIVE BANNER ADJUST (load + resize) */
(function() {
  const imgs = Array.from(document.querySelectorAll('.banner-slider img.banner-item'));
  if (!imgs.length) return;
  imgs.forEach(img => {
    const cs = getComputedStyle(img);
    img.dataset.origLeft = img.style.left || cs.left || '';
  });
  function adjustBanner() {
    const w = window.innerWidth;
    if (w < 800) {
      imgs.forEach(img => {
        img.style.left = '50%';
        img.style.maxWidth = '90%';
      });
    } else {
      imgs.forEach(img => {
        if (img.dataset.origLeft) img.style.left = img.dataset.origLeft;
        else img.style.left = '';
        img.style.maxWidth = '';
      });
    }
  }
  adjustBanner();
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(adjustBanner, 120);
  });
})();
