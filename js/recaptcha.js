document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            alert("Por favor, confirme o reCAPTCHA.");
            return;
        }

        fetch('fetch('https://alcateiavoleibol-jracsjo73-alcateia-voleibols-projects.vercel.app/api/verify', {
', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: recaptchaResponse })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                enviarFormulario(form);
            } else {
                alert("Falha na validação do reCAPTCHA. Tente novamente.");
                grecaptcha.reset();
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro ao validar reCAPTCHA.");
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
                grecaptcha.reset();
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
