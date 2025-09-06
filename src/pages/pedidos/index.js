document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona os containers das colunas e o painel principal
    const contAFazer = document.getElementById('container-aFazer');
    const contEmPreparo = document.getElementById('container-emPreparo');
    const contPronto = document.getElementById('container-pronto');
    const pedidosBoard = document.querySelector('.pedidos-board'); // Seleciona o pai de todas as colunas

    // Mapeia o status do pedido para o container correspondente
    const statusMap = {
        'aFazer': contAFazer,
        'emPreparo': contEmPreparo,
        'pronto': contPronto
    };

    // Função para criar o HTML de um card de pedido
    function createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.id = `order-${order.id}`;
        card.dataset.id = order.id; // Adiciona o ID do pedido ao elemento para fácil acesso

        const itemsList = order.items.map(item => 
            `<li><span>${item.quantity}x ${item.name}</span> <span>${formatCurrency(item.price * item.quantity)}</span></li>`
        ).join('');
        
        const orderTime = new Date(order.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        let actionButtonHTML = '';
        // Define o botão com base no status do pedido
        if (order.status === 'aFazer') {
            actionButtonHTML = '<button class="action-btn" data-action="start">Iniciar Preparo</button>';
        } else if (order.status === 'emPreparo') {
            actionButtonHTML = '<button class="action-btn" data-action="ready">Pedido Pronto</button>';
        } else if (order.status === 'pronto') {
            actionButtonHTML = '<button class="action-btn" data-action="finish">Finalizar</button>';
        }

        card.innerHTML = `
            <div class="card-header">
                <span>Pedido #${order.id}</span>
                <span>Mesa ${order.table} - ${order.clients} Clientes</span>
            </div>
            <div class="card-body"><ul>${itemsList}</ul></div>
            <div class="card-footer">
                <span class="time">${orderTime}</span>
                <div class="actions">${actionButtonHTML}</div>
            </div>`;
        return card;
    }

    // Função para carregar e exibir todos os pedidos do localStorage
    function loadOrders() {
        Object.values(statusMap).forEach(container => container.innerHTML = '');

        const allOrders = JSON.parse(localStorage.getItem('omniChefOrders')) || [];
        
        if (allOrders.length === 0) {
            contAFazer.innerHTML = '<p style="text-align:center; color:#6c757d; margin-top:20px;">Nenhum pedido no momento.</p>';
        }

        allOrders.forEach(order => {
            const cardElement = createOrderCard(order);
            const targetContainer = statusMap[order.status];
            if (targetContainer) {
                targetContainer.appendChild(cardElement);
            }
        });
    }

    // Função para atualizar o status de um pedido
    function updateOrderStatus(orderId, newStatus) {
        let allOrders = JSON.parse(localStorage.getItem('omniChefOrders')) || [];
        const orderIndex = allOrders.findIndex(order => order.id == orderId);

        if (orderIndex !== -1) {
            // Se o novo status é 'finalizado', removemos o pedido. Caso contrário, atualizamos.
            if (newStatus === 'finished') {
                allOrders.splice(orderIndex, 1);
            } else {
                allOrders[orderIndex].status = newStatus;
            }
            localStorage.setItem('omniChefOrders', JSON.stringify(allOrders));
            loadOrders(); // Recarrega a interface para refletir a mudança
        }
    }

    // Formata um número para a moeda brasileira
    const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;
    
    // Adiciona o "escutador" de eventos no painel principal
    pedidosBoard.addEventListener('click', (event) => {
        const target = event.target;

        // Verifica se o elemento clicado é um botão de ação
        if (target.matches('.action-btn')) {
            const action = target.dataset.action;
            const card = target.closest('.order-card');
            const orderId = card.dataset.id;
            
            if (action === 'start') {
                updateOrderStatus(orderId, 'emPreparo');
            } else if (action === 'ready') {
                updateOrderStatus(orderId, 'pronto');
            } else if (action === 'finish') {
                // Confirmação antes de remover o pedido
                if (confirm(`Tem certeza que deseja finalizar o Pedido #${orderId}?`)) {
                    updateOrderStatus(orderId, 'finished');
                }
            }
        }
    });

    // Função para atualizar data e hora no cabeçalho
    function updateDateTime() {
        const now = new Date();
        const datetimeEl = document.getElementById('datetime');
        if (datetimeEl) {
            datetimeEl.textContent = now.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });
        }
    }

    // Funções iniciais ao carregar a página
    loadOrders();
    updateDateTime();
    setInterval(updateDateTime, 1000); // Atualiza o relógio a cada segundo
});