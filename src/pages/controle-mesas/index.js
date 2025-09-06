// ARQUIVO: controle-mesas/index.js (VERSÃO COMPLETA E CORRIGIDA)

document.addEventListener('DOMContentLoaded', () => {
    const salaoGrid = document.getElementById('salao-grid');
    const painelPedido = document.getElementById('painel-pedido');
    const addMesaBtn = document.querySelector('.adicionar-Mesa');
    const removeMesaBtn = document.querySelector('.remover-Mesa'); // <-- Pega o novo botão

    // Função para obter as configurações, como o número total de mesas
    function getSaloonConfig() {
        const config = JSON.parse(localStorage.getItem('omniChefConfig'));
        if (!config || !config.totalTables) {
            return { totalTables: 6 };
        }
        return config;
    }

    // Função para salvar as configurações
    function saveSaloonConfig(config) {
        localStorage.setItem('omniChefConfig', JSON.stringify(config));
    }

    // Função para formatar moeda
    const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;

    // --- LÓGICA PARA ADICIONAR MESA ---
    addMesaBtn.addEventListener('click', () => {
        if (confirm('Deseja adicionar uma nova mesa ao salão?')) {
            const config = getSaloonConfig();
            config.totalTables++;
            saveSaloonConfig(config);
            renderSaloon();
        }
    });

    // --- NOVA LÓGICA PARA REMOVER MESA ---
    removeMesaBtn.addEventListener('click', () => {
        const config = getSaloonConfig();
        const lastTableId = config.totalTables;

        if (lastTableId <= 1) {
            alert('Não é possível remover. O salão deve ter no mínimo 1 mesa.');
            return;
        }

        const tablesData = JSON.parse(localStorage.getItem('omniChefTables')) || [];
        const lastTableInfo = tablesData.find(t => t.id === lastTableId);

        // REGRA DE SEGURANÇA: Verifica se a última mesa está em uso
        if (lastTableInfo && lastTableInfo.status !== 'livre') {
            alert(`A Mesa ${lastTableId} não pode ser removida pois está ${lastTableInfo.status}. Finalize o pedido ou a reserva primeiro.`);
            return;
        }

        // Confirmação final
        if (confirm(`Tem certeza que deseja remover a Mesa ${lastTableId} do salão?`)) {
            config.totalTables--;
            saveSaloonConfig(config);
            // Remove qualquer dado residual da mesa que foi deletada
            const updatedTablesData = tablesData.filter(t => t.id !== lastTableId);
            localStorage.setItem('omniChefTables', JSON.stringify(updatedTablesData));
            renderSaloon();
        }
    });

    // Função principal que desenha o salão
    function renderSaloon() {
        salaoGrid.innerHTML = '';
        const config = getSaloonConfig();
        const tablesData = JSON.parse(localStorage.getItem('omniChefTables')) || [];

        for (let i = 1; i <= config.totalTables; i++) {
            const tableInfo = tablesData.find(t => t.id === i);
            const status = tableInfo ? tableInfo.status : 'livre';

            const btn = document.createElement('button');
            btn.className = `mesa-btn ${status}`;
            btn.style.backgroundImage = `url('/Aplicativo_OmniChef/public/assets/images/Imagens/mesas_imgs/table.svg')`;
            btn.innerHTML = `<span>Mesa ${i}</span>`;
            
            btn.addEventListener('click', () => showTableDetails(i));
            
            salaoGrid.appendChild(btn);
        }
    }

    // Função que mostra os detalhes da mesa no painel direito
    function showTableDetails(tableId) {
        let tablesData = JSON.parse(localStorage.getItem('omniChefTables')) || [];
        const table = tablesData.find(t => t.id === tableId);
        const status = table ? table.status : 'livre';

        // Painel para mesa LIVRE
        if (status === 'livre') {
            painelPedido.innerHTML = `
                <div class="informacoes-mesa">
                    <h2>Mesa ${tableId}</h2>
                    <p><strong>STATUS:</strong> Livre</p>
                    <hr>
                    <p class="placeholder-text">Esta mesa está disponível.</p>
                    <button class="btn-reservar" data-table-id="${tableId}">Reservar Mesa</button>
                </div>`;
            return;
        }

        // Painel para mesa RESERVADA
        if (status === 'reservada') {
            painelPedido.innerHTML = `
                <div class="informacoes-mesa">
                    <h2>Mesa ${tableId}</h2>
                    <p><strong>STATUS:</strong> <span class="status-reservada">Reservada</span></p>
                    <p><strong>RESERVA:</strong> ${table.reservationName || 'Não informado'}</p>
                    <hr>
                    <p class="placeholder-text">Para usar a mesa, inicie um pedido para ela na página de Menu.</p>
                    <button class="btn-cancelar-reserva" data-table-id="${tableId}">Cancelar Reserva</button>
                </div>`;
            return;
        }

        // Painel para mesa OCUPADA
        if (status === 'ocupada') {
            let totalConsumo = 0;
            let totalPrepTime = 0;
            let itemsHTML = '';

            table.orders.forEach(order => {
                order.items.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    totalConsumo += itemTotal;
                    if (item.prepTime) {
                        totalPrepTime += item.prepTime * item.quantity;
                    }
                    itemsHTML += `<li>${item.quantity}x ${item.name} <span>${formatCurrency(itemTotal)}</span></li>`;
                });
            });

            painelPedido.innerHTML = `
                <div class="informacoes-mesa">
                    <h2>Mesa ${table.name || `Mesa ${table.id}`}</h2>
                    <p><strong>STATUS:</strong> <span class="status-ocupada">Ocupada</span></p>
                    <p><strong>CLIENTES:</strong> ${table.clients}</p>
                    <p><strong>PREPARO TOTAL:</strong> <i class="fa-solid fa-hourglass-half"></i> ${totalPrepTime} Minutos</p>
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
    }

    // LÓGICA DE AÇÕES NO PAINEL (RESERVAR, FECHAR, CANCELAR)
    painelPedido.addEventListener('click', (event) => {
        const target = event.target;
        const tableId = parseInt(target.dataset.tableId);
        
        if (target.matches('.btn-reservar')) {
            const reservationName = prompt('Reservar mesa em nome de:');
            if (reservationName) {
                let tablesData = JSON.parse(localStorage.getItem('omniChefTables')) || [];
                const tableIndex = tablesData.findIndex(t => t.id === tableId);
                const newReservation = { id: tableId, status: 'reservada', reservationName: reservationName, orders: [], clients: 0 };
                if (tableIndex !== -1) { tablesData[tableIndex] = newReservation; } else { tablesData.push(newReservation); }
                localStorage.setItem('omniChefTables', JSON.stringify(tablesData));
                renderSaloon();
                showTableDetails(tableId);
            }
        }
        
        if (target.matches('.btn-cancelar-reserva') || target.matches('.btn-fechar')) {
            const isClosing = target.matches('.btn-fechar');
            const message = isClosing ? `Tem certeza que deseja fechar a conta da Mesa ${tableId}?` : `Tem certeza que deseja cancelar a reserva da Mesa ${tableId}?`;
            if (confirm(message)) {
                let tablesData = JSON.parse(localStorage.getItem('omniChefTables')) || [];
                const updatedTablesData = tablesData.filter(t => t.id !== tableId);
                localStorage.setItem('omniChefTables', JSON.stringify(updatedTablesData));
                painelPedido.innerHTML = `<div class="informacoes-mesa"><h2>Selecione uma mesa</h2><p>Os pedidos e informações aparecerão aqui.</p></div>`;
                renderSaloon();
            }
        }
    });
    
    // Atualiza data e hora
    function updateDateTime() {
        const now = new Date();
        const element = document.getElementById("dataHora");
        if (element) {
            const date = now.toLocaleDateDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
            const time = now.toLocaleTimeString("pt-BR");
            element.innerHTML = `<span class="data">${date}</span> <span class="hora">${time}</span>`;
        }
    }

    // Inicialização da página
    renderSaloon();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});
