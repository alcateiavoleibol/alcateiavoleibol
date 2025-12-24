AOS.init({ duration: 1000, once: true });

// --- GLOBAL: TRATAMENTO DE ERRO DE IMAGEM ROBUSTO ---
document.addEventListener('error', function(e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        if(e.target.dataset.triedFallback === 'true') {
            console.log("Fallback também falhou para: " + e.target.src);
            return;
        }
        e.target.dataset.triedFallback = 'true';
        // Ajuste o caminho se necessário (ex: ../imagens/...)
        e.target.src = 'imagens/galeria/alcateia.jpg';
        e.target.alt = 'Imagem indisponível';
    }
}, true);

// --- FUNÇÃO PARA FORÇAR DOWNLOAD (PROFISSIONAL) ---
async function forceDownload(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erro ao baixar (possível CORS ou local):', error);
        window.open(url, '_blank');
    }
}

// --- FUNÇÃO PARA EMBARALHAR A GALERIA COM EFEITO 3D ---
let isShuffling = false;

function shuffleGallery() {
    if(isShuffling) return; 
    isShuffling = true;
    
    const btn = document.getElementById('shuffleBtn');
    const originalBtnText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ORGANIZANDO...';

    const container = document.getElementById('main-gallery-grid');
    const items = Array.from(container.children);
    
    // 1. Efeito de Saída
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('shuffling-out');
        }, index * 10);
    });

    // 2. Aguarda a animação de saída terminar
    setTimeout(() => {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        items.forEach(item => {
            container.appendChild(item);
            item.classList.remove('shuffling-out');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.5)';
        });

        // 3. Efeito de Entrada
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('shuffling-in');
                setTimeout(() => { 
                    item.classList.remove('shuffling-in'); 
                    item.style.opacity = '1'; 
                    item.style.transform = 'none';
                }, 500);
            }, index * 30);
        });
        
        new SimpleLightbox('.gallery-grid a', { overlayOpacity: 0.95, animationSpeed: 250 });
        
        setTimeout(() => {
            btn.innerHTML = originalBtnText;
            isShuffling = false;
        }, items.length * 30 + 500);

    }, 600);
}

// --- FUNÇÃO PARA TOCAR VÍDEOS VERTICAIS (CORRIGIDO TIKTOK) ---
function playVerticalVideo(type) {
    let container, cover, embedCode;
    
    if (type === 'shorts') {
        container = document.getElementById('video-container-shorts');
        cover = document.getElementById('cover-shorts');
        embedCode = `
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/CjBnR4NM9vY?autoplay=1&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 15px;"></iframe>
        `;
        
        if (container && cover) {
            cover.style.display = 'none';
            container.innerHTML = embedCode;
        }

    } else if (type === 'tiktok') {
        container = document.getElementById('video-container-tiktok');
        cover = document.getElementById('cover-tiktok');
        
        // Embed padrão do TikTok, mas sem tamanhos fixos
        embedCode = `
            <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@alcateiavoleibol/video/7586806658018381072" data-video-id="7586806658018381072" style="max-width: unset; min-width: unset; width: 100%; height: 100%;"> 
                <section> <a target="_blank" title="@alcateiavoleibol" href="https://www.tiktok.com/@alcateiavoleibol?refer=embed">@alcateiavoleibol</a> </section> 
            </blockquote>
        `;

        if (container && cover) {
            cover.style.display = 'none';
            container.innerHTML = embedCode;
            
            // FORÇA O CARREGAMENTO DO SCRIPT DO TIKTOK DINAMICAMENTE
            let oldScript = document.getElementById('tiktok-script-loader');
            if(oldScript) oldScript.remove();

            let script = document.createElement('script');
            script.src = "https://www.tiktok.com/embed.js";
            script.async = true;
            script.id = 'tiktok-script-loader';
            document.body.appendChild(script);
        }
    }
}

// --- FUNÇÃO DO VÍDEO PRINCIPAL ---
function playVideo(device) {
    const videoId = 'nh3Ydq6pTw0';
    let container, cover;

    if (device === 'desktop') {
        container = document.getElementById('video-container-desktop');
        cover = document.getElementById('cover-desktop');
    } else {
        container = document.getElementById('video-container-mobile');
        cover = document.getElementById('cover-mobile');
    }

    if (cover) cover.style.display = 'none';

    container.innerHTML = `
        <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1&controls=1" width="100%" height="100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
}

// --- MODO CINEMA ---
const cinemaOverlay = document.getElementById('cinema-overlay');
const cinemaContainer = document.getElementById('cinemaContainer');
const bgMusic = document.getElementById('bg-music');

function openCinema(type) {
    cinemaOverlay.classList.add('active');
    if (!bgMusic.paused) toggleMusic();

    let embedCode = '';

    if (type === 'main') {
        const videoId = 'nh3Ydq6pTw0';
        embedCode = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1" width="100%" height="100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        cinemaContainer.innerHTML = embedCode;

    } else if (type === 'shorts') {
        embedCode = `<iframe src="https://www.youtube.com/embed/CjBnR4NM9vY?autoplay=1&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="aspect-ratio: 9/16; height: 90vh; max-width: 500px; border-radius: 10px;"></iframe>`;
        cinemaContainer.innerHTML = embedCode;

    } else if (type === 'tiktok') {
            embedCode = `
            <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@alcateiavoleibol/video/7586806658018381072" data-video-id="7586806658018381072" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@alcateiavoleibol" href="https://www.tiktok.com/@alcateiavoleibol?refer=embed">@alcateiavoleibol</a> </section> </blockquote> 
        `;
        cinemaContainer.innerHTML = embedCode;

        // Reinjeta script também no cinema
        let oldScript = document.getElementById('tiktok-script-loader-cinema');
        if(oldScript) oldScript.remove();

        let script = document.createElement('script');
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        script.id = 'tiktok-script-loader-cinema';
        document.body.appendChild(script);
    }
}

function closeCinema() {
    cinemaOverlay.classList.remove('active');
    cinemaContainer.innerHTML = ''; 
}

// --- MODAL WALLPAPER ---
const wpModal = document.getElementById('wallpaper-modal');
const wpTarget = document.getElementById('wp-modal-target');

function openWallpaperModal(imgSrc) {
    wpTarget.src = imgSrc;
    wpModal.classList.add('active');
}
function closeWallpaperModal() {
    wpModal.classList.remove('active');
}


// --- START JOURNEY ---
function startJourney() {
    const intro = document.getElementById('intro-screen');
    const musicContainer = document.getElementById('music-player-container');
    intro.classList.add('hidden');
    document.body.classList.add('scroll-active');
    bgMusic.play().then(() => { toggleMusicUI(true); }).catch(e => { console.log("Autoplay bloqueado."); });
    bgMusic.volume = 0.5;
    musicContainer.classList.add('visible');
}

// --- CONTAGEM REGRESSIVA E CELEBRAÇÃO ---
// ATENÇÃO: Defina a data correta aqui. Ex: 'Jan 1, 2026 00:00:00'
const countDate = new Date('Jan 1, 2026 00:00:00').getTime();

// CONFIGURAÇÃO DOS SLOGANS DINÂMICOS
const slogansList = [
    "Se hoje estamos aqui é porque a quadra nos uniu.",
    "Não é um tapa no saque, é uma <span style='color:var(--christmas-red); font-weight:900;'>P***ADA</span> na viagem!"
];
let sloganIndex = 0;

// --- NOVO EFEITO: FADE SUAVE (ELEGANTE E ESTÁVEL) ---
function rotateSlogans(element) {
    // 1. Define o primeiro slogan imediatamente e visível
    element.innerHTML = slogansList[sloganIndex];
    element.style.opacity = '1';

    const updateText = () => {
        // Passo 1: Fade Out (Sair suavemente) - usa classe auxiliar do CSS
        element.classList.add('fade-out');
        
        // Aguarda o tempo do fade-out (800ms, sincronizado com o CSS)
        setTimeout(() => {
            // Passo 2: Troca o texto enquanto está invisível
            sloganIndex = (sloganIndex + 1) % slogansList.length;
            element.innerHTML = slogansList[sloganIndex];
            
            // Passo 3: Fade In (Entrar suavemente)
            element.classList.remove('fade-out');
        }, 800); 
    };

    // Troca a cada 4.5 segundos (tempo suficiente para leitura + transição)
    setInterval(updateText, 4500);
    
    // Reforço de confetes na troca (opcional, mas legal)
    setInterval(() => {
        confetti({ particleCount: 15, spread: 80, origin: { y: 0.8 } });
    }, 4500);
}

function celebrationProtocol() {
    const countdownEl = document.getElementById('countdown');
    const msgEl = document.getElementById('ny-message');
    const dynamicSlogan = document.getElementById('dynamic-slogan');
    
    if(countdownEl.style.display !== 'none') {
        countdownEl.style.opacity = '0';
        setTimeout(() => {
            countdownEl.style.display = 'none';
            msgEl.style.display = 'block';
            loopFireworks(); // Chama função de loop infinito
            rotateSlogans(dynamicSlogan); // Inicia rotação suave
        }, 500);
    }
}

// FOGOS EM LOOP INFINITO
function loopFireworks() {
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999999 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    // Dispara um pouco de confete a cada 2.5s para sempre
    setInterval(function() {
        confetti(Object.assign({}, defaults, { particleCount: 50, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount: 50, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 2500); 
    
    // Explosão inicial
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const gap = countDate - now;

    if (gap < 0) {
        clearInterval(countdownInterval);
        celebrationProtocol();
    } else {
        const second = 1000; const minute = second * 60; const hour = minute * 60; const day = hour * 24;
        document.getElementById('d').innerText = Math.floor(gap / day);
        document.getElementById('h').innerText = Math.floor((gap % day) / hour);
        document.getElementById('m').innerText = Math.floor((gap % hour) / minute);
        document.getElementById('s').innerText = Math.floor((gap % minute) / second);
    }
}, 1000);

// --- GALERIA ---
const galleryContainer = document.getElementById('main-gallery-grid');
let galleryHTML = '';
for (let i = 1; i <= 35; i++) {
    galleryHTML += `<a href="imagens/galeria/alcateia (${i}).jpg" class="gallery-item"><img src="imagens/galeria/alcateia (${i}).jpg"></a>`;
}
galleryContainer.innerHTML = galleryHTML;
new SimpleLightbox('.gallery-grid a', { overlayOpacity: 0.95, animationSpeed: 250 });

// --- SWIPER ---
var swiper = new Swiper(".mySwiper", {
    effect: "coverflow", grabCursor: false, centeredSlides: true, slidesPerView: "auto",
    loop: true, speed: 800, autoplay: { delay: 1500, disableOnInteraction: false },
    coverflowEffect: { rotate: 0, stretch: 0, depth: 200, modifier: 1, slideShadows: true },
});

// --- SLOGAN INTERATIVO ---
const sloganImg = document.getElementById('anim-slogan');
sloganImg.addEventListener('click', function() {
    if(this.classList.contains('breaking')) return;
    this.classList.add('breaking');
    setTimeout(() => { this.classList.remove('breaking'); }, 1500); 
});

// --- PARTICULAS DE ENERGIA ---
const energyContainer = document.getElementById('energy-container');
function createEnergySpark() {
    const spark = document.createElement('div');
    spark.classList.add('energy-spark');
    if(Math.random() > 0.5) { spark.classList.add('blue'); }
    spark.style.left = Math.random() * 100 + '%';
    const duration = Math.random() * 2 + 1;
    spark.style.animationDuration = duration + 's';
    const size = Math.random() * 3 + 1;
    spark.style.width = size + 'px';
    spark.style.height = (size * 3) + 'px';
    energyContainer.appendChild(spark);
    setTimeout(() => { spark.remove(); }, duration * 1000);
}
setInterval(createEnergySpark, 150);

// --- CONFETES (BOTÃO) ---
function lancarConfetes() {
    var duration = 3 * 1000; var end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

// --- COMPARTILHAR ---
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: 'Retrospectiva 2025 - Alcateia Voleibol',
            text: 'Confira os melhores momentos da nossa temporada! 🐺🏐',
            url: window.location.href,
        }).catch((error) => console.log('Erro ao compartilhar', error));
    } else {
        alert("Compartilhe esse link com a galera!");
    }
}

// --- SCROLL TO TOP ---
const btnTop = document.getElementById("btn-top");
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// --- CONTROLES DE MÚSICA ---
const playIcon = document.getElementById('play-icon');
const playerUi = document.getElementById('player-ui');

function toggleMusic() {
    if (bgMusic.paused) { bgMusic.play(); toggleMusicUI(true); } else { bgMusic.pause(); toggleMusicUI(false); }
}

function toggleMusicUI(isPlaying) {
    if(isPlaying) {
        playIcon.classList.remove('fa-play'); playIcon.classList.add('fa-pause'); playerUi.classList.remove('paused');
    } else {
        playIcon.classList.remove('fa-pause'); playIcon.classList.add('fa-play'); playerUi.classList.add('paused');
    }
}

function adjustVolume(amount) {
    let newVolume = bgMusic.volume + amount;
    if (newVolume > 1) newVolume = 1; if (newVolume < 0) newVolume = 0;
    bgMusic.volume = newVolume;
}

// --- NEVE ---
const snowContainer = document.getElementById('snow-container');
for(let i=0; i<30; i++) {
    let flake = document.createElement('div'); flake.className = 'snowflake'; flake.innerHTML = '❄';
    flake.style.left = Math.random() * 100 + '%';
    flake.style.animationDuration = (Math.random() * 3 + 2) + 's';
    flake.style.opacity = Math.random(); flake.style.fontSize = (Math.random() * 10 + 10) + 'px';
    snowContainer.appendChild(flake);
}

window.addEventListener('scroll', () => { 
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 50);
    
    // Lógica do botão topo
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btnTop.classList.add("show");
    } else {
        btnTop.classList.remove("show");
    }
});
document.addEventListener('contextmenu', e => e.preventDefault());

// --- TÍTULO DINÂMICO (CHARME EXTRA) ---
let docTitle = document.title;
window.addEventListener("blur", () => { 
    document.title = "Ei, volta pra quadra! 🏐"; 
});
window.addEventListener("focus", () => { 
    document.title = docTitle; 
});