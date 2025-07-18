document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu-list');

    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('show');
        });
    }
});
