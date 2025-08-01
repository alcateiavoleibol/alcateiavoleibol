export default async function handler(req, res) {
    // Liberação de CORS para o domínio personalizado
    res.setHeader('Access-Control-Allow-Origin', 'https://alcateiavoleibol.com.br');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Lidar com requisições preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método não permitido' });
    }

    const secretKey = "6Lcb75QrAAAAADd1MLKIUxZI8LM6ZUqDl12E2vno"; // Chave secreta reCAPTCHA v3
    const resendAPIKey = "re_Ar4ZQzJk_3TninL9ia2ajxa8aUxT6wSs8";    // API Key Resend

    const token = req.body['g-recaptcha-response'];
    if (!token) {
        return res.status(400).json({ success: false, message: "Token reCAPTCHA não enviado." });
    }

    // Verificar reCAPTCHA
    const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`
    });

    const recaptchaData = await recaptchaRes.json();
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return res.status(400).json({ success: false, message: 'Falha na validação reCAPTCHA', score: recaptchaData.score });
    }

    // Dados do formulário
    const {
        Nome,
        Telefone,
        Email,
        Sexo,
        Mensagem,
        "Como conheceu?": Origem,
        "Outro (especifique)": Outro,
        "Probabilidade de Indicação": Indicacao
    } = req.body;

    const origemFinal = Origem === "Outros" ? `Outros - ${Outro}` : Origem;

    // Enviar e-mail via Resend API
    const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${resendAPIKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Contato Alcateia <contato@alcateiavoleibol.com.br>',
            to: ['alcateiavoleibol2023@gmail.com'],
            subject: `Novo contato de ${Nome}`,
            html: `
                <h2>Novo contato através do site</h2>
                <p><strong>Nome:</strong> ${Nome}</p>
                <p><strong>Telefone:</strong> ${Telefone}</p>
                <p><strong>Email:</strong> ${Email}</p>
                <p><strong>Sexo:</strong> ${Sexo}</p>
                <p><strong>Origem:</strong> ${origemFinal}</p>
                <p><strong>Probabilidade de Indicação:</strong> ${Indicacao}</p>
                <p><strong>Mensagem:</strong> ${Mensagem}</p>
            `
        })
    });

    if (emailRes.ok) {
        return res.status(200).json({ success: true, message: 'E-mail enviado com sucesso' });
    } else {
        const errorData = await emailRes.json();
        return res.status(500).json({ success: false, message: 'Erro ao enviar e-mail', error: errorData });
    }
}
