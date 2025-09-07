import { db } from '../../../public/js/firebase-config.js';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona os containers das colunas
    const contAFazer = document.getElementById('container-aFazer');
    const contEmPreparo = document.getElementById('container-emPreparo');
    const contPronto = document.getElementById('container-pronto');
    const pedidosBoard = document.querySelector('.pedidos-board');

    const statusMap = {
        'aFazer': contAFazer,
        'emPreparo': contEmPreparo,
        'pronto': contPronto
    };

    // --- LISTENER EM TEMPO REAL PARA A COLEÇÃO DE PEDIDOS ---
    const q = query(collection(db, "orders"), orderBy("timestamp", "asc"));

    onSnapshot(q, (querySnapshot) => {
        // Limpa todas as colunas antes de redesenhar
        Object.values(statusMap).forEach(container => container.innerHTML = '');
        
        if (querySnapshot.empty) {
            contAFazer.innerHTML = '<p style="text-align:center; color:#6c757d; margin-top:20px;">Nenhum pedido no momento.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const order = { ...doc.data(), id: doc.id }; 
            const cardElement = createOrderCard(order);
            const targetContainer = statusMap[order.status];
            if (targetContainer) {
                targetContainer.appendChild(cardElement);
            }
        });
    });

    // Função para criar o HTML de um card de pedido
    function createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.dataset.id = order.id;

        const itemsList = order.items.map(item => 
            `<li><span>${item.quantity}x ${item.name}</span> <span>${formatCurrency(item.price * item.quantity)}</span></li>`
        ).join('');
        
        const orderTime = order.timestamp.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        let actionButtonHTML = '';
        if (order.status === 'aFazer') {
            actionButtonHTML = '<button class="action-btn" data-action="start">Iniciar Preparo</button>';
        } else if (order.status === 'emPreparo') {
            actionButtonHTML = '<button class="action-btn" data-action="ready">Pedido Pronto</button>';
        } else if (order.status === 'pronto') {
            actionButtonHTML = '<button class="action-btn" data-action="finish">Finalizar</button>';
        }

        card.innerHTML = `
            <div class="card-header">
                <span>Pedido #${order.id}</span> <span>Mesa ${order.table} - ${order.clients} Clientes</span>
            </div>
            <div class="card-body"><ul>${itemsList}</ul></div>
            <div class="card-footer">
                <span class="time">${orderTime}</span>
                <div class="actions">${actionButtonHTML}</div>
            </div>`;
        return card;
    }

    // --- AÇÕES QUE MODIFICAM OS DADOS NO FIREBASE ---
    pedidosBoard.addEventListener('click', async (event) => {
        const target = event.target;

        if (target.matches('.action-btn')) {
            const action = target.dataset.action;
            const card = target.closest('.order-card');
            const orderId = card.dataset.id;
            const orderRef = doc(db, "orders", orderId);

            try {
                if (action === 'start') {
                    await updateDoc(orderRef, { status: 'emPreparo' });
                } else if (action === 'ready') {
                    await updateDoc(orderRef, { status: 'pronto' });
                } else if (action === 'finish') {
                    if (confirm(`Tem certeza que deseja finalizar este pedido?`)) {
                        await deleteDoc(orderRef);
                    }
                }
            } catch (error) {
                console.error("Erro ao atualizar o status do pedido:", error);
                alert("Não foi possível atualizar o pedido. Tente novamente.");
            }
        }
    });

    // Funções de ajuda
    const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;

    function updateDateTime() {
        const now = new Date();
        const datetimeEl = document.getElementById('datetime');
        if (datetimeEl) {
            datetimeEl.textContent = now.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });
        }
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
});