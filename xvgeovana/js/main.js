// --- Lógica do Slideshow Automático e Manual ---
let slideIndex = 1;
let slideInterval; 

function plusSlides(n) {
    showSlides(slideIndex += n);
    resetAutoSlide(); 
}

function currentSlide(n) {
    showSlides(slideIndex = n);
    resetAutoSlide();
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

function startAutoSlide() {
    slideInterval = setInterval(function() {
        plusSlides(1);
    }, 5000); // Muda a cada 5 segundos
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// --- Animação de Elementos ao Scroll ---
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
    threshold: 0.2, // Anima um pouco antes
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('animated');
            appearOnScroll.unobserve(entry.target); 
        }
    });
}, appearOptions);


// --- Lógica dos Vagalumes (Fireflies) ---
function createFireflies() {
    const container = document.querySelector('.firefly-container');
    if (!container) return; // Não executa se o container não existir
    
    const numFireflies = 25; 

    for (let i = 0; i < numFireflies; i++) {
        let firefly = document.createElement('div');
        firefly.className = 'firefly';
        
        let x = Math.random() * 100;
        let y = Math.random() * 100;
        
        let duration = Math.random() * 10 + 8;
        let delay = Math.random() * 10;
        
        firefly.style.left = x + 'vw';
        firefly.style.top = y + 'vh';
        firefly.style.animationDuration = duration + 's';
        firefly.style.animationDelay = delay + 's';
        
        container.appendChild(firefly);
    }
}

// --- NOVO: Lógica do Temporizador ---
function startCountdown() {
    // Data do evento: 31 de Janeiro de 2026, 19:00 (Fuso horário local)
    // Nota: Meses em JS são 0-indexed (Janeiro = 0)
    const countDownDate = new Date("Jan 31, 2026 19:00:00").getTime();

    const countdownElement = document.getElementById("timer");
    if (!countdownElement) return; // Não executa se o timer não existir

    // Atualiza o contador a cada 1 segundo
    const x = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        // Cálculos de tempo
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Exibe o resultado nos elementos
        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;

        // Se a contagem acabar
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "<p>A festa começou!</p>";
        }
    }, 1000);
}


// --- Event Listener para Iniciar Funções ---
document.addEventListener("DOMContentLoaded", function() {
    // Inicia Slideshow
    showSlides(slideIndex);
    startAutoSlide(); 
    
    // Inicia Animação de Scroll
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Inicia Vagalumes
    createFireflies();

    // Inicia Temporizador
    startCountdown();
});