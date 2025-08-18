document.addEventListener("DOMContentLoaded", () => {
  console.log("Mapa Alcateia Voleibol carregado com estilo.");

  // Efeito de entrada suave
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.transition = "opacity 1s ease-in-out";
    document.body.style.opacity = 1;
  }, 100);
});