// ---- DADOS DAS MESAS ----
const tables = [
  { id: 1, name: 'T1', image: '/Aplicativo_OmniChef/public/assets/images/Imagens/mesas_imgs/table.svg', status: 'livre' },
  { id: 2, name: 'T2', image: '/Aplicativo_OmniChef/public/assets/images/Imagens/mesas_imgs/table.svg', status: 'ocupada' },
  { id: 3, name: 'T3', image: '/Aplicativo_OmniChef/public/assets/images/Imagens/mesas_imgs/table.svg', status: 'livre' },
  { id: 4, name: 'T4', image: '/Aplicativo_OmniChef/public/assets/images/Imagens/mesas_imgs/table.svg', status: 'livre' },
  { id: 5, name: 'T5', image: '/Aplicativo_OmniChef/public/assets/images/Imagens/mesas_imgs/table.svg', status: 'ocupada' },
  { id: 6, name: 'T6', image: '/Aplicativo_OmniChef/public/assets/images/Imagens/mesas_imgs/table.svg', status: 'livre' },
];

const salaoGrid = document.getElementById('salao-grid');

function renderTables() {
  salaoGrid.innerHTML = '';
  tables.forEach(table => {
    const btn = document.createElement('button');
    btn.classList.add('mesa-btn');
    if (table.status === 'ocupada') btn.classList.add('ocupada');
    if (table.status === 'livre') btn.classList.add('livre');

    // imagem de fundo
    btn.style.backgroundImage = `url('${table.image}')`;

    // texto da mesa
    btn.innerHTML = `<span>${table.name}</span>`;

    // clique da mesa
    btn.onclick = () => abrirMesa(table.id);

    salaoGrid.appendChild(btn);
  });
}

function atualizarDataHora() {
  const agora = new Date();

  // Data formatada
  const data = agora.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  // Hora formatada
  const hora = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  document.getElementById("dataHora").innerHTML = `
    <span class="data">${data}</span>
    <span class="hora">${hora}</span>
  `;
}

// Chama ao carregar
atualizarDataHora();
setInterval(atualizarDataHora, 1000);

// ---- FUNÇÃO ABRIR MESA ----
function abrirMesa(id) {
  const mesa = tables.find(t => t.id === id);

  // Exemplo de pedidos fictícios (depois pode vir do banco)
  const pedidosMock = [
    { nome: "Batata c/ cheddar", preco: 25 },
    { nome: "Calabresa acebolada", preco: 30 },
    { nome: "Coca-cola 600ml", preco: 8 }
  ];

  const total = pedidosMock.reduce((acc, item) => acc + item.preco, 0);

  const painel = document.querySelector(".informacoes-mesa");
  painel.innerHTML = `
    <h2>PEDIDO #${mesa.id}</h2>
    <p><strong>MESA:</strong> ${mesa.name}</p>

    <p><strong>STATUS:</strong> 
      <select id="statusSelect">
        <option value="livre" ${mesa.status === "livre" ? "selected" : ""}>Livre</option>
        <option value="ocupada" ${mesa.status === "ocupada" ? "selected" : ""}>Ocupada</option>
      </select>
    </p>

    <p><strong>CLIENTES:</strong>
      <select id="clientesSelect">
        ${Array.from({length: 10}, (_, i) => i + 1)
          .map(n => `<option value="${n}" ${mesa.clientes === n ? "selected" : ""}>${n}</option>`)
          .join("")}
      </select>
    </p>

    <h3>Itens consumidos</h3>
    <ul class="lista-pedidos">
      ${pedidosMock.map(item => `
        <li>${item.nome} <span>R$ ${item.preco}</span></li>
      `).join("")}
    </ul>

    <p><strong>Total:</strong> R$ ${total}</p>
    <button class="btn-fechar">Fechar conta</button>
  `;

  // captura dos selects
  const statusSelect = painel.querySelector("#statusSelect");
  const clientesSelect = painel.querySelector("#clientesSelect");

  statusSelect.addEventListener("change", () => {
    mesa.status = statusSelect.value;
    renderTables(); // atualiza cor no salão
  });

  clientesSelect.addEventListener("change", () => {
    mesa.clientes = parseInt(clientesSelect.value);
  });

  // ação do botão de fechar conta
  painel.querySelector(".btn-fechar").onclick = () => {
    alert(`Conta da ${mesa.name} fechada! Total: R$${total}`);
    mesa.status = "livre";
    renderTables();
  };
}


// Renderizar mesas no início
renderTables();
