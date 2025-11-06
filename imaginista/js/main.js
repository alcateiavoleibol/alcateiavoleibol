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
  const menu    = $('.main-menu'); 
  if (!mascot || !menu) return; 

  mascot.addEventListener('click', () => {
    mascot.classList.add('animate');
    setTimeout(() => mascot.classList.remove('animate'), 800);
    menu.classList.toggle('open'); 
  });
})();


/* ================================================
  FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
  (Controles de Áudio, Tema e Partículas)
  ================================================
*/
function initializeApp() {
  const themeBtn= $('.theme-toggle'); // Botão de Tema
  const playBtn = $('#play-pause'); // Botão Play/Pause
  const volUp   = $('#vol-up');
  const volDown = $('#vol-down');
  const audio   = $('#bg-music');
  const html = document.documentElement;

  // --- 1. Lógica de Áudio ---
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸️';
      } else {
        audio.pause();
        playBtn.textContent = '▶️';
      }
    });
  }

  if (volUp) {
    volUp.addEventListener('click', () => {
      if (audio) audio.volume = Math.min(1, audio.volume + 0.1);
    });
  }

  if (volDown) {
    volDown.addEventListener('click', () => {
      if (audio) audio.volume = Math.max(0, audio.volume - 0.1);
    });
  }

  // Tenta dar play automático (pode falhar no Chrome/Mobile)
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
  
  // Verifica se a biblioteca tsParticles carregou
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
        // As linhas (REDE)
        links: { 
          distance: 150, 
          enable: true,  // <-- ISSO ATIVA A REDE
          opacity: 0.4, 
          width: 1 
        },
        move: { direction: "none", enable: true, outModes: "out", random: false, speed: 2, straight: false },
        number: { density: { enable: true, area: 800 }, value: 80 },
        opacity: {
          value: 0.5,
        },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    };

    // --- Definição das Cores ---
    const lightColor = "#6C9BCF"; // AZUL (para tema claro)
    const darkColor = "#FFFFFF";  // BRANCO (para tema escuro)

    // Configuração do Tema Claro (Alternativo)
    const lightOptions = {
      ...baseOptions,
      particles: {
        ...baseOptions.particles,
        color: { value: lightColor }, 
        links: { ...baseOptions.particles.links, color: lightColor },
      },
    };

    // Configuração do Tema Escuro (Padrão)
    const darkOptions = {
      ...baseOptions,
      particles: {
        // === A CORREÇÃO ESTÁ AQUI ===
        ...baseOptions.particles, // <-- Estava 'baseOpcions'
        color: { value: darkColor }, 
        links: { ...baseOptions.particles.links, color: darkColor },
      },
    };
    
    // Função para carregar as partículas
    const loadParticles = async (options) => {
      // Verifica se o container existe antes de carregar
      if (!$("#tsparticles-bg")) {
        console.error('O elemento #tsparticles-bg não foi encontrado no HTML.');
        return;
      }
      await tsParticles.load({
        id: "tsparticles-bg", 
        options: options,
      });
    };

    // Função para ATUALIZAR o ícone do botão
    const updateButtonIcon = (theme) => {
      if (themeBtn) {
        if (theme === 'dark') {
          themeBtn.textContent = '☀️'; // Tema escuro (mostra sol)
        } else {
          themeBtn.textContent = '🌓'; // Tema claro (mosta lua)
        }
      }
    };

    // Lógica do Botão de Tema
    if (themeBtn) {
      themeBtn.addEventListener('click', async () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        updateButtonIcon(newTheme); // Atualiza o ícone
        
        // Recarrega as partículas com as novas cores
        const instance = tsParticles.dom.find(i => i.id === "tsparticles-bg");
        if (instance) {
          const newOptions = newTheme === 'dark' ? darkOptions : lightOptions;
          await instance.options.load(newOptions);
          await instance.refresh();
        }
      });
    } // Fim do if (themeBtn)
    
    // --- Carregamento Inicial ---
    const initialTheme = html.getAttribute('data-theme') || 'dark'; 
    loadParticles(initialTheme === 'dark' ? darkOptions : lightOptions);
    
    // Define o ícone inicial correto no carregamento
    updateButtonIcon(initialTheme);

  } else {
    // Este erro aparece se o script da biblioteca de partículas falhar
    console.error('tsParticles library not loaded. Make sure the script link is correct in your HTML.');
  }
  
} // --- Fim da função initializeApp ---


/* ================================================
  INICIALIZAÇÃO SEGURA
  Verifica se a página já carregou ou espera o evento 'load'
  ================================================
*/
if (document.readyState === 'complete') {
  // Se a página já carregou (o 'load' já disparou), executa a função agora.
  initializeApp();
} else {
  // Se a página ainda não carregou, adiciona o listener para esperar o 'load'.
  window.addEventListener('load', initializeApp);
}