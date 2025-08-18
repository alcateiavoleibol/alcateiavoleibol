document.addEventListener("DOMContentLoaded", () => {
  // Alternar tema escuro
  window.toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
  };

  // Filtro (exemplo básico)
  document.getElementById("bairro").addEventListener("change", (e) => {
    console.log("Bairro selecionado:", e.target.value);
  });

  document.getElementById("tipo").addEventListener("change", (e) => {
    console.log("Tipo de quadra:", e.target.value);
  });
});