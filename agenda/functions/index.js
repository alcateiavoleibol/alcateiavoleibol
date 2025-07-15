const functions = require("firebase-functions");
const axios = require("axios");

const GITHUB_TOKEN = "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";
const REPO_OWNER = "alcateiavoleibol";
const REPO_NAME = "alcateiavoleibol";
const FILE_PATH = "agenda/agenda.json";

exports.salvarAgenda = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Método não permitido.");
  }

  const novosDados = req.body;
  const conteudoAtual = JSON.stringify(novosDados, null, 2);
  const base64Content = Buffer.from(conteudoAtual).toString("base64");

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

  try {
    const getResp = await axios.get(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "Firebase-Function"
      }
    });

    const sha = getResp.data.sha;

    const putResp = await axios.put(url, {
      message: "Atualizando agenda via Firebase",
      content: base64Content,
      sha: sha
    }, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "Firebase-Function"
      }
    });

    res.status(200).json({ sucesso: true, commit: putResp.data.commit.sha });
  } catch (error) {
    console.error("Erro ao salvar no GitHub:", error.response?.data || error.message);
    res.status(500).json({ erro: "Erro ao salvar no GitHub." });
  }
});
