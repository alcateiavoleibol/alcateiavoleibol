
let current = 0;
const slides = document.querySelectorAll(".slide");
setInterval(() => {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");
}, 3000);
