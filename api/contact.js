export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método não permitido' });
    }

    const secretKey = "6Lcb75QrAAAAADd1MLKIUxZI8LM6ZUqDl12E2vno";
    const token = req.body['g-recaptcha-response'];

    if (!token) {
        return res.status(400).json({ success: false, message: "Token não enviado." });
    }

    // Validação do reCAPTCHA
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`
    });

    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success) {
        return res.status(400).json({ success: false, message: 'Falha no reCAPTCHA', errors: recaptchaData['error-codes'] });
    }

    // Envio de e-mail via Resend
    const { Nome, Telefone, Email, Sexo, Mensagem } = req.body;

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer SUA_API_KEY_RESEND`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Contato Alcateia <contato@alcateiavoleibol.com.br>',
            to: ['alcateiavoleibol2023@gmail.com'],
            subject: `Novo contato de ${Nome}`,
            html: `
                <p><strong>Nome:</strong> ${Nome}</p>
                <p><strong>Telefone:</strong> ${Telefone}</p>
                <p><strong>Email:</strong> ${Email}</p>
                <p><strong>Sexo:</strong> ${Sexo}</p>
                <p><strong>Mensagem:</strong> ${Mensagem}</p>
            `
        })
    });

    if (response.ok) {
        return res.status(200).json({ success: true });
    } else {
        const errorData = await response.json();
        return res.status(500).json({ success: false, message: 'Falha ao enviar e-mail', error: errorData });
    }
}
