// Utilitários
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Banners animados no topo
(function bannerAnimation() {
  const banners = $$('.top-banner img');
  if (!banners.length) return; // Proteção
  
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
  if (!items.length || !pagination) return; // Proteção

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
  if (!slogan) return; // Proteção
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
  if (!mascot || !menu) return; // Proteção

  mascot.addEventListener('click', () => {
    mascot.classList.add('animate');
    setTimeout(() => mascot.classList.remove('animate'), 800);
    menu.classList.toggle('open'); 
  });
})();


/* Controles de Áudio, Tema e Partículas.
*/
window.addEventListener('load', () => {
  const themeBtn= $('.desktop-controls .theme-toggle');
  const playBtn = $('.desktop-controls #play-pause');
  const volUp   = $('.desktop-controls #vol-up');
  const volDown = $('.desktop-controls #vol-down');
  const audio   = $('#bg-music');
  const html = document.documentElement;

  // --- 1. Lógica de Áudio (Protegida por '?.') ---
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
    if (audio) audio.volume = Math.min(1, audio.volume + 0.1);
  });
  volDown?.addEventListener('click', () => {
    if (audio) audio.volume = Math.max(0, audio.volume - 0.1);
  });

  // Autoplay do Áudio (só roda se o áudio existir)
  if (audio) {
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
  }
  
  // --- 2. Lógica de Partículas e Tema ---
  
  // Roda em todas as páginas
  if (typeof tsParticles !== 'undefined') {
    
    // Configuração base (comum para ambos os temas)
    const baseOptions = {
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
        },
      },
      particles: {
        links: { distance: 150, enable: true, opacity: 0.4, width: 1 },
        move: { direction: "none", enable: true, outModes: "out", random: false, speed: 2, straight: false },
        number: { density: { enable: true, area: 800 }, value: 80 },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    };

    // CORREÇÃO: Cores codificadas DIRETAMENTE no JS
    
    // Configuração do Tema Claro
    const lightOptions = {
      ...baseOptions,
      particles: {
        ...baseOptions.particles,
        color: { value: "#333333" }, // Cinza Escuro
        links: { ...baseOptions.particles.links, color: "#333333" },
      },
    };

    // Configuração do Tema Escuro
    const darkOptions = {
      ...baseOptions,
      particles: {
        ...baseOptions.particles,
        color: { value: "#FFD700" }, // Dourado
        links: { ...baseOptions.particles.links, color: "#FFD700" },
      },
    };
    
    // Função para carregar as partículas
    const loadParticles = async (options) => {
      await tsParticles.load({
        id: "tsparticles-bg", 
        options: options,
      });
    };

    // Lógica do Botão de Tema (Protegida por '?.')
    themeBtn?.addEventListener('click', async () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      
      const instance = tsParticles.dom.find(i => i.id === "tsparticles-bg");
      if (instance) {
        // Simplesmente carrega as opções corretas
        const newOptions = newTheme === 'dark' ? darkOptions : lightOptions;
        await instance.options.load(newOptions);
        await instance.refresh();
      }
    });
    
    // Carregamento Inicial (em todas as páginas)
    const initialTheme = html.getAttribute('data-theme') || 'light';
    loadParticles(initialTheme === 'dark' ? darkOptions : lightOptions);

  } else {
    console.error('tsParticles library not loaded.');
  }
  
}); // Fim do window.addEventListener('load')