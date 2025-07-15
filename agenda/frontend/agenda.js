async function salvarNoGitHub() {
    const resposta = await fetch("https://alcateiavoleibol.github.io/alcateiavoleibol/agenda/backend/save_agenda.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jogos) // 'jogos' deve ser o array atualizado
    });

    const resultado = await resposta.json();
    if (resultado.sucesso) {
        alert("Agenda salva com sucesso no GitHub!");
    } else {
        alert("Erro ao salvar: " + (resultado.erro || "desconhecido"));
    }
}
