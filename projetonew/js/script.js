document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu-list');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('show');
        });

        // Fecha o menu automaticamente ao clicar em um item (útil para mobile)
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                menu.classList.remove('show');
            });
        });
    }
});

