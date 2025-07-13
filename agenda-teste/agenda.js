const SENHA_CORRETA = "2025";
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
  
  // Formulário de adicionar jogo
  document.getElementById('form-jogo').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = document.getElementById('data').value;
    const horaInicio = document.getElementById('hora-inicio').value;
    const horaTermino = document.getElementById('hora-termino').value;
    const local = document.getElementById('local').value;
    
    const jogo = {
      id: Date.now(),
      data,
      horaInicio,
      horaTermino,
      local
    };
    
    adicionarJogo(jogo);
    this.reset();
  });
});

function carregarJogos() {
  const jogos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const listaJogos = document.getElementById('lista-jogos');
  listaJogos.innerHTML = '';
  
  jogos.forEach(jogo => {
    const li = criarElementoJogo(jogo);
    listaJogos.appendChild(li);
  });
}

function criarElementoJogo(jogo) {
  const li = document.createElement('li');
  
  li.innerHTML = `
    <div>
      <strong>${formatarData(jogo.data)}</strong><br>
      ${jogo.horaInicio} - ${jogo.horaTermino}<br>
      Local: ${jogo.local}
    </div>
    <div class="acoes">
      <button class="editar" data-id="${jogo.id}">Editar</button>
      <button class="excluir" data-id="${jogo.id}">Excluir</button>
    </div>
  `;
  
  li.querySelector('.excluir').addEventListener('click', () => excluirJogo(jogo.id));
  li.querySelector('.editar').addEventListener('click', () => editarJogo(jogo.id));
  
  return li;
}

function adicionarJogo(jogo) {
  const jogos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  jogos.push(jogo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jogos));
  carregarJogos();
}

function excluirJogo(id) {
  if (prompt("Digite a senha para excluir:") !== SENHA_CORRETA) {
    alert("Senha incorreta!");
    return;
  }
  
  let jogos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  jogos = jogos.filter(jogo => jogo.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jogos));
  carregarJogos();
}

function editarJogo(id) {
  if (prompt("Digite a senha para editar:") !== SENHA_CORRETA) {
    alert("Senha incorreta!");
    return;
  }
  
  const jogos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const jogo = jogos.find(j => j.id === id);
  
  if (!jogo) return;
  
  document.getElementById('data').value = jogo.data;
  document.getElementById('hora-inicio').value = jogo.horaInicio;
  document.getElementById('hora-termino').value = jogo.horaTermino;
  document.getElementById('local').value = jogo.local;
  
  // Remove o jogo antigo
  excluirJogo(id);
}

function formatarData(dataString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', options);
}

// Função para carregar próximos jogos na página principal
function carregarProximosJogos() {
  const jogos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const container = document.getElementById('proximos-jogos');
  
  if (!container) return;
  
  // Ordena por data mais próxima
  const jogosOrdenados = jogos.sort((a, b) => new Date(a.data) - new Date(b.data));
  
  // Pega os próximos 4 jogos
  const proximosJogos = jogosOrdenados.slice(0, 4);
  
  if (proximosJogos.length === 0) {
    container.innerHTML = '<p>Nenhum jogo agendado</p>';
    return;
  }
  
  let html = '';
  proximosJogos.forEach(jogo => {
    html += `
      <div class="jogo-card">
        <div class="data-jogo">${formatarData(jogo.data)}</div>
        <div class="horario-jogo">${jogo.horaInicio} - ${jogo.horaTermino}</div>
        <div class="local-jogo">Local: ${jogo.local}</div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Carrega ao iniciar e sempre que a agenda é atualizada
carregarProximosJogos();