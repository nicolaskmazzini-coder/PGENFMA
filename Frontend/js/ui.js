// ==========================================
// UI.JS - avatar no header e item de nav ativo
// ==========================================

(function () {
  // Marca o link da nav correspondente à página atual
  const atual = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.topnav a').forEach((a) => {
    const destino = a.getAttribute('href');
    if (destino && destino.split('?')[0] === atual) a.classList.add('nav-ativa');
  });

  // Preenche os avatares (foto salva ou iniciais do nome)
  const foto = localStorage.getItem('pgenfma_foto') || '';
  const nome = localStorage.getItem('nome_cliente') || localStorage.getItem('email_cliente') || '';
  const iniciais = nome
    ? nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('')
    : 'P';

  document.querySelectorAll('[data-avatar]').forEach((el) => {
    if (foto) {
      el.style.backgroundImage = 'url(' + foto + ')';
      el.textContent = '';
    } else {
      el.textContent = iniciais.toUpperCase();
    }
  });
})();

// ==========================================
// Skeletons de carregamento (globais)
// Uso: lista.innerHTML = esqueleto(3)
//      box.innerHTML = esqueletoCard('sk-full')
// ==========================================

function esqueleto(n = 3) {
  let html = '';
  for (let i = 0; i < n; i++) {
    html += '<li class="sk">' +
      '<div class="sk-linha larga"></div>' +
      '<div class="sk-linha media"></div>' +
      '</li>';
  }
  return html;
}

function esqueletoCard(classeExtra = '') {
  return '<div class="sk-card' + (classeExtra ? ' ' + classeExtra : '') + '">' +
    '<div class="sk-linha larga"></div>' +
    '<div class="sk-linha media"></div>' +
    '<div class="sk-linha curta"></div>' +
    '</div>';
}
