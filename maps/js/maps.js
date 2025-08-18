document.addEventListener("DOMContentLoaded", () => {
  const themeButton = document.querySelector(".toggle-theme");
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("visible");
    }, 200 * index);
  });

  console.log("Página Alcateia Voleibol carregada com sucesso.");
});

let map;

function initMap() {
  // Localização padrão (caso o usuário não permita acesso)
  const defaultLocation = { lat: -22.9068, lng: -43.1729 }; // Ex: Rio de Janeiro

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 14,
  });

  // 🔍 Detectar localização do usuário
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Centraliza o mapa na localização do usuário
      map.setCenter(userLocation);

      // Adiciona marcador na posição atual
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Você está aqui",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      });
    }, function() {
      console.warn("Usuário negou acesso à localização.");
    });
  } else {
    console.warn("Geolocalização não é suportada pelo navegador.");
  }

  // 🖱️ Permitir que o usuário adicione marcadores ao clicar
  map.addListener("click", function(e) {
    new google.maps.Marker({
      position: e.latLng,
      map: map,
      title: "Marcador personalizado"
    });
  });
}