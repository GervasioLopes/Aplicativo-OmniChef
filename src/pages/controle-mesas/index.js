// ARQUIVO: controle-mesas/index.js (VERSÃO FINAL COM RELÓGIO CORRIGIDO)

import { db } from '../../../public/js/firebase-config.js';
import { collection, doc, onSnapshot, setDoc, deleteDoc, runTransaction } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const salaoGrid = document.getElementById('salao-grid');
    const painelPedido = document.getElementById('painel-pedido');
    const addMesaBtn = document.querySelector('.adicionar-Mesa');
    const removeMesaBtn = document.querySelector('.remover-Mesa');

    let totalTables = 6;
    let tablesData = [];

    // --- OUVINTES EM TEMPO REAL DO FIREBASE ---

    onSnapshot(doc(db, "saloonConfig", "main"), (docSnap) => {
        if (docSnap.exists()) {
            totalTables = docSnap.data().totalTables;
        } else {
            setDoc(doc(db, "saloonConfig", "main"), { totalTables: 6 });
        }
        renderSaloon();
    });

    onSnapshot(collection(db, "tables"), (querySnapshot) => {
        tablesData = [];
        querySnapshot.forEach((doc) => {
            tablesData.push({ id: parseInt(doc.id), ...doc.data() });
        });
        renderSaloon();
    });

    // --- FUNÇÕES DE INTERAÇÃO COM O FIREBASE ---

    addMesaBtn.addEventListener('click', async () => {
        if (confirm('Deseja adicionar uma nova mesa ao salão?')) {
            const newTotal = totalTables + 1;
            await setDoc(doc(db, "saloonConfig", "main"), { totalTables: newTotal });
        }
    });

    removeMesaBtn.addEventListener('click', async () => {
        const lastTableId = totalTables;
        if (lastTableId <= 1) {
            alert('O salão deve ter no mínimo 1 mesa.');
            return;
        }
        const lastTableInfo = tablesData.find(t => t.id === lastTableId);
        if (lastTableInfo && lastTableInfo.status !== 'livre') {
            alert(`A Mesa ${lastTableId} não pode ser removida pois está ${lastTableInfo.status}.`);
            return;
        }
        if (confirm(`Tem certeza que deseja remover a Mesa ${lastTableId}?`)) {
            if (lastTableInfo) {
                await deleteDoc(doc(db, "tables", lastTableId.toString()));
            }
            await setDoc(doc(db, "saloonConfig", "main"), { totalTables: totalTables - 1 });
        }
    });

    // --- FUNÇÕES DE RENDERIZAÇÃO E UI ---

    function renderSaloon() {
        salaoGrid.innerHTML = '';
        for (let i = 1; i <= totalTables; i++) {
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

    function showTableDetails(tableId) {
        const table = tablesData.find(t => t.id === tableId);
        const status = table ? table.status : 'livre';
        const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;

        if (status === 'livre') {
            painelPedido.innerHTML = `<div class="informacoes-mesa"><h2>Mesa ${tableId}</h2><p><strong>STATUS:</strong> Livre</p><hr><p class="placeholder-text">Esta mesa está disponível.</p><button class="btn-reservar" data-table-id="${tableId}">Reservar Mesa</button></div>`;
        } else if (status === 'reservada') {
            painelPedido.innerHTML = `<div class="informacoes-mesa"><h2>Mesa ${tableId}</h2><p><strong>STATUS:</strong> <span class="status-reservada">Reservada</span></p><p><strong>RESERVA:</strong> ${table.reservationName || 'Não informado'}</p><hr><p class="placeholder-text">Para usar a mesa, inicie um pedido para ela na página de Menu.</p><button class="btn-cancelar-reserva" data-table-id="${tableId}">Cancelar Reserva</button></div>`;
        } else if (status === 'ocupada') {
            let totalConsumo = 0;
            let totalPrepTime = 0;
            let itemsHTML = '';
            if(table.orders && table.orders.length > 0) {
                table.orders.forEach(order => {
                    order.items.forEach(item => {
                        const itemTotal = item.price * item.quantity;
                        totalConsumo += itemTotal;
                        if (item.prepTime) { totalPrepTime += item.prepTime * item.quantity; }
                        itemsHTML += `<li>${item.quantity}x ${item.name} <span>${formatCurrency(itemTotal)}</span></li>`;
                    });
                });
            }
            painelPedido.innerHTML = `<div class="informacoes-mesa"><h2>Mesa ${table.name || `Mesa ${table.id}`}</h2><p><strong>STATUS:</strong> <span class="status-ocupada">Ocupada</span></p><p><strong>CLIENTES:</strong> ${table.clients}</p><p><strong>PREPARO TOTAL:</strong> <i class="fa-solid fa-hourglass-half"></i> ${totalPrepTime} Minutos</p><hr><h3>Itens Consumidos</h3><ul class="lista-pedidos">${itemsHTML}</ul><div class="total-container"><strong>Total:</strong><span>${formatCurrency(totalConsumo)}</span></div><button class="btn-fechar" data-table-id="${table.id}">Fechar Conta</button></div>`;
        }
    }
    
    painelPedido.addEventListener('click', async (event) => {
        const target = event.target;
        if (!target.dataset.tableId) return;
        const tableId = target.dataset.tableId;

        if (target.matches('.btn-reservar')) {
            const reservationName = prompt('Reservar mesa em nome de:');
            if (reservationName) {
                const tableDoc = { status: 'reservada', reservationName: reservationName };
                await setDoc(doc(db, "tables", tableId), tableDoc);
            }
        }
        
        if (target.matches('.btn-cancelar-reserva') || target.matches('.btn-fechar')) {
            const message = target.matches('.btn-fechar') ? `Fechar a conta da Mesa ${tableId}?` : `Cancelar a reserva da Mesa ${tableId}?`;
            if (confirm(message)) {
                await deleteDoc(doc(db, "tables", tableId));
                painelPedido.innerHTML = `<div class="informacoes-mesa"><h2>Selecione uma mesa</h2><p>Os pedidos e informações aparecerão aqui.</p></div>`;
            }
        }
    });

    // **FUNÇÃO DO RELÓGIO REINSERIDA ABAIXO**
    function atualizarDataHora() {
        const agora = new Date();
        const data = agora.toLocaleDateString("pt-BR", {
            weekday: "long", day: "2-digit", month: "long", year: "numeric"
        });
        const hora = agora.toLocaleTimeString("pt-BR");
        const dataHoraEl = document.getElementById("dataHora");
        if (dataHoraEl) {
            dataHoraEl.innerHTML = `<span class="data">${data}</span> <span class="hora">${hora}</span>`;
        }
    }

    // Ponto de partida de toda a aplicação
    renderSaloon();

    // **INICIALIZAÇÃO DO RELÓGIO REINSERIDA ABAIXO**
    atualizarDataHora(); // Chama a primeira vez
    setInterval(atualizarDataHora, 1000); // Atualiza a cada segundo
});