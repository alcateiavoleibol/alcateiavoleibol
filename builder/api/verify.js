export default async function handler(req, res) {
    const secretKey = "6Lcb75QrAAAAADd1MLKIUxZI8LM6ZUqDl12E2vno";  // <-- Coloque sua CHAVE SECRETA AQUI
    const token = req.body.token;

    if (!token) {
        return res.status(400).json({ success: false, message: "Token não enviado." });
    }

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`
    });

    const data = await response.json();
    if (data.success) {
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false, errors: data['error-codes'] });
    }
}
