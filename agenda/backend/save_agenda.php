<?php
// ⚠️ Não compartilhe este arquivo com o token incluído publicamente

$token = "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";
$usuario = "alcateiavoleibol";
$repositorio = "alcateiavoleibol";
$caminhoArquivo = "agenda/agenda.json";

$data = json_decode(file_get_contents("php://input"), true);
$novoConteudo = json_encode($data, JSON_PRETTY_PRINT);
$base64Content = base64_encode($novoConteudo);

// Obter SHA atual do arquivo
$ch = curl_init("https://api.github.com/repos/$usuario/$repositorio/contents/$caminhoArquivo");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: token $token",
    "User-Agent: PHP-Agent"
]);
$response = curl_exec($ch);
$dados = json_decode($response, true);
$sha = $dados['sha'] ?? null;
curl_close($ch);

if (!$sha) {
    http_response_code(500);
    echo json_encode(["erro" => "Não foi possível obter o SHA do arquivo."]);
    exit;
}

// Enviar PUT com novo conteúdo
$payload = json_encode([
    "message" => "Atualizando agenda via backend seguro",
    "content" => $base64Content,
    "sha" => $sha
]);

$ch = curl_init("https://api.github.com/repos/$usuario/$repositorio/contents/$caminhoArquivo");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: token $token",
    "User-Agent: PHP-Agent",
    "Content-Type: application/json"
]);
$resposta = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode === 200 || $httpcode === 201) {
    echo json_encode(["sucesso" => true]);
} else {
    http_response_code(500);
    echo json_encode(["erro" => "Falha ao salvar no GitHub.", "codigo" => $httpcode]);
}
?>
