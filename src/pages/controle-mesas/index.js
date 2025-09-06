document.addEventListener('DOMContentLoaded', () => {
    const salaoGrid = document.getElementById('salao-grid');
    const painelPedido = document.getElementById('painel-pedido');
    const TOTAL_DE_MESAS_NO_SALAO = 6; // Defina o número total de mesas aqui

    // Função para formatar moeda
    const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;

    // Função principal que desenha o salão
    function renderSaloon() {
        salaoGrid.innerHTML = '';
        let tablesData = JSON.parse(localStorage.getItem('omniChefTables')) || [];

        for (let i = 1; i <= TOTAL_DE_MESAS_NO_SALAO; i++) {
            const tableInfo = tablesData.find(t => t.id === i);
            const status = tableInfo ? tableInfo.status : 'livre';

            const btn = document.createElement('button');
            btn.className = `mesa-btn ${status}`;
            btn.style.backgroundImage = `url('/Aplicativo_OmniChef/public/assets/images/Imagens/mesas_imgs/table.svg')`;
            btn.innerHTML = `<span>Mesa ${i}</span>`;
            
            // Adiciona um listener para mostrar os detalhes da mesa ao clicar
            btn.addEventListener('click', () => showTableDetails(i));
            
            salaoGrid.appendChild(btn);
        }
    }

    // Função que mostra os detalhes da mesa no painel direito
    function showTableDetails(tableId) {
        let tablesData = JSON.parse(localStorage.getItem('omniChefTables')) || [];
        const table = tablesData.find(t => t.id === tableId);

        if (!table || table.status === 'livre') {
            painelPedido.innerHTML = `
                <div class="informacoes-mesa">
                    <h2>Mesa ${tableId}</h2>
                    <p><strong>STATUS:</strong> Livre</p>
                    <hr>
                    <p class="placeholder-text">Para abrir uma conta, vá até a página de Menu e envie um novo pedido para esta mesa.</p>
                </div>`;
            return;
        }

        // Se a mesa está ocupada, montamos os detalhes
        let totalConsumo = 0;
        let itemsHTML = '';

        // Itera sobre todos os pedidos da mesa
        table.orders.forEach(order => {
            // Itera sobre os itens de cada pedido
            order.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalConsumo += itemTotal;
                itemsHTML += `<li>${item.quantity}x ${item.name} <span>${formatCurrency(itemTotal)}</span></li>`;
            });
        });

        painelPedido.innerHTML = `
            <div class="informacoes-mesa">
                <h2>Mesa ${table.name || `Mesa ${table.id}`}</h2>
                <p><strong>STATUS:</strong> <span class="status-ocupada">Ocupada</span></p>
                <p><strong>CLIENTES:</strong> ${table.clients}</p>
                <hr>
                <h3>Itens Consumidos</h3>
                <ul class="lista-pedidos">${itemsHTML}</ul>
                <div class="total-container">
                    <strong>Total:</strong>
                    <span>${formatCurrency(totalConsumo)}</span>
                </div>
                <button class="btn-fechar" data-table-id="${table.id}">Fechar Conta</button>
            </div>`;
    }

    // Delegação de evento para o botão "Fechar Conta"
    painelPedido.addEventListener('click', (event) => {
        if (event.target.matches('.btn-fechar')) {
            const tableIdToClose = parseInt(event.target.dataset.tableId);
            if (confirm(`Tem certeza que deseja fechar a conta da Mesa ${tableIdToClose}?`)) {
                closeTableBill(tableIdToClose);
            }
        }
    });

    // Função para fechar a conta de uma mesa
    function closeTableBill(tableId) {
        let tablesData = JSON.parse(localStorage.getItem('omniChefTables')) || [];
        // Filtramos a lista, removendo a mesa que foi fechada
        const updatedTablesData = tablesData.filter(t => t.id !== tableId);
        
        localStorage.setItem('omniChefTables', JSON.stringify(updatedTablesData));
        
        // Limpa o painel e redesenha o salão
        painelPedido.innerHTML = `
            <div class="informacoes-mesa">
                <h2>Selecione uma mesa</h2>
                <p>Os pedidos e informações aparecerão aqui.</p>
            </div>`;
        renderSaloon();
    }

    function updateDateTime() {
        const now = new Date();
        const element = document.getElementById("dataHora");
        if (element) {
            const date = now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
            const time = now.toLocaleTimeString("pt-BR");
            element.innerHTML = `<span class="data">${date}</span> <span class="hora">${time}</span>`;
        }
    }

    // Inicialização da página
    renderSaloon();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});
