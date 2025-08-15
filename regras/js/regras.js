document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main section");
  const menuLinks = document.querySelectorAll(".menu a");

  // Animação de entrada
  sections.forEach((sec, index) => {
    sec.style.opacity = 0;
    sec.style.transform = "translateY(20px)";
    setTimeout(() => {
      sec.style.transition = "all 0.6s ease";
      sec.style.opacity = 1;
      sec.style.transform = "translateY(0)";
    }, 300 * index);
  });

  // Observa a rolagem e destaca a seção/menu ativo
  const observer = new IntersectionObserver(
    entries => {
     