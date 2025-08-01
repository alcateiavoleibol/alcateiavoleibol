  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide img");
  setInterval(() => {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }, 3000);