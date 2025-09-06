document.addEventListener('DOMContentLoaded', () => {
    
    const contAFazer = document.getElementById('container-aFazer');
    const contEmPreparo = document.getElementById('container-emPreparo');
    const contPronto = document.getElementById('container-pronto');

    const statusMap = {
        'aFazer': contAFazer,
        'emPreparo': contEmPreparo,
        'pronto': contPronto
    };

    function createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.id = `order-${order.id}`;

        const itemsList = order.items.map(item => 
            `<li><span>${item.quantity}x ${item.name}</span> <span>${formatCurrency(item.price * item.quantity)}</span></li>`
        ).join('');
        
        const orderTime = new Date(order.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        let actionButtonHTML = '';
        if (order.status === 'aFazer') { actionButtonHTML = '<button>Iniciar Preparo</button>'; } 
        else if (order.status === 'emPreparo') { actionButtonHTML = '<button>Pedido Pronto</button>'; } 
        else if (order.status === 'pronto') { actionButtonHTML = '<button>Finalizar</button>'; }

        // Corrigido para ler a propriedade 'clients' que salvamos
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

    const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;

    function updateDateTime() {
        const now = new Date();
        const datetimeEl = document.getElementById('datetime');
        if (datetimeEl) {
            datetimeEl.textContent = now.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });
        }
    }

    loadOrders();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});