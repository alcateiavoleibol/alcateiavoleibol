const SENHA_CORRETA = "2020";
const STORAGE_KEY = "agenda_jogos";

document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('login-section');
  const adminSection = document.getElementById('admin-section');
  const btnLogin = document.getElementById('btn-login');
  const senhaInput = document.getElementById('senha');
  const loginMessage = document.getElementById('login-message');
  
  // Verificar se já está logado
  if (localStorage.getItem('logado') === 'true') {
    loginSection.classList.add('hidden');
    adminSection.classList.remove('hidden');
    carregarJogos();
  }
  
  btnLogin.addEventListener('click', () => {
    if (senhaInput.value === SENHA_CORRETA) {
      localStorage.setItem('logado', 'true');
      loginSection.classList.add('hidden');
      adminSection.classList.remove('hidden');
      carregarJogos();
    } else {
      loginMessage.textContent = "Senha incorreta!";
    }
  });
