document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        grecaptcha.ready(function() {
            grecaptcha.execute('6LeTME4rAAAAAAAORlAzu67I3RVQ3R6_eTC6x0QC', {action: 'submit'}).then(function(token) {
                // Verificar no backend (API /api/verify)
                fetch('/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: token })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        enviarFormulario(form);
                    } else {
                        alert("Falha na validação do reCAPTCHA. Tente novamente.");
                    }
                })
                .catch(error => {
                    console.error("Erro ao validar reCAPTCHA:", error);
                    alert("Erro ao validar reCAPTCHA.");
                });
            });
        });
    });

    function enviarFormulario(form) {
        const formData = new FormData(form);
        fetch("https://formsubmit.co/alcateiavoleibol2023@gmail.com", {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                successMessage.style.display = "block";
                form.reset();
            } else {
                alert("Erro ao enviar o formulário. Tente novamente.");
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro ao enviar formulário.");
        });
    }
});
