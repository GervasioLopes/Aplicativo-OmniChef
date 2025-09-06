// ARQUIVO: controle-mesas/index.js (VERSÃO COMPLETA COM FIREBASE)

// Importa o 'db' do nosso arquivo de configuração e as funções do Firestore
import { db } from '../../../public/js/firebase-config.js';
import { collection, doc, onSnapshot, setDoc, deleteDoc, runTransaction } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const salaoGrid = document.getElementById('salao-grid');
    const painelPedido = document.getElementById('painel-pedido');
    const addMesaBtn = document.querySelector('.adicionar-Mesa');
    const removeMesaBtn = document.querySelector('.remover-Mesa');

    let totalTables = 6; // Valor inicial padrão
    let tablesData = []; // Armazenará os dados das mesas em tempo real

    // --- OUVINTES EM TEMPO REAL DO FIREBASE ---

    // 1. Ouve em tempo real as configurações do salão (ex: total de mesas)
    onSnapshot(doc(db, "saloonConfig", "main"), (docSnap) => {
        if (docSnap.exists()) {
            totalTables = docSnap.data().totalTables;
        } else {
            // Se a configuração não existe no Firebase, cria com o valor padrão
            setDoc(doc(db, "saloonConfig", "main"), { totalTables: 6 });
        }
        renderSaloon(); // Redesenha o salão sempre que a config mudar
    });

    // 2. Ouve em tempo real a coleção de mesas (status, pedidos, etc.)
    onSnapshot(collection(db, "tables"), (querySnapshot) => {
        tablesData = [];
        querySnapshot.forEach((doc) => {
            tablesData.push({ id: parseInt(doc.id), ...doc.data() });
        });
        renderSaloon(); // Redesenha o salão sempre que uma mesa mudar
    });

    // --- FUNÇÕES DE INTERAÇÃO COM O FIREBASE ---

    // Adicionar Mesa
    addMesaBtn.addEventListener('click', async () => {
        if (confirm('Deseja adicionar uma nova mesa ao salão?')) {
            const newTotal = totalTables + 1;
            await setDoc(doc(db, "saloonConfig", "main"), { totalTables: newTotal });
            // A atualização da tela será automática graças ao onSnapshot
        }
    });

    // Remover Mesa
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
            // Remove o documento da mesa, se existir
            if (lastTableInfo) {
                await deleteDoc(doc(db, "tables", lastTableId.toString()));
            }
            // Atualiza a configuração
            await setDoc(doc(db, "saloonConfig", "main"), { totalTables: totalTables - 1 });
        }
    });

    // --- FUNÇÕES DE RENDERIZAÇÃO E UI (semelhantes às anteriores) ---

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
        // A lógica interna aqui continua muito parecida, pois `tablesData` já está atualizado
        const table = tablesData.find(t => t.id === tableId);
        const status = table ? table.status : 'livre';

        if (status === 'livre') {
            painelPedido.innerHTML = `<div class="informacoes-mesa"><h2>Mesa ${tableId}</h2><p><strong>STATUS:</strong> Livre</p><hr><p class="placeholder-text">Esta mesa está disponível.</p><button class="btn-reservar" data-table-id="${tableId}">Reservar Mesa</button></div>`;
        } else if (status === 'reservada') {
            painelPedido.innerHTML = `<div class="informacoes-mesa"><h2>Mesa ${tableId}</h2><p><strong>STATUS:</strong> <span class="status-reservada">Reservada</span></p><p><strong>RESERVA:</strong> ${table.reservationName || 'Não informado'}</p><hr><p class="placeholder-text">Para usar a mesa, inicie um pedido para ela na página de Menu.</p><button class="btn-cancelar-reserva" data-table-id="${tableId}">Cancelar Reserva</button></div>`;
        } else if (status === 'ocupada') {
            let totalConsumo = 0;
            let totalPrepTime = 0;
            let itemsHTML = '';
            const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;

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

    // Função de data e hora (sem alterações)
    function updateDateTime() {
        // Seu código de data e hora continua igual
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
});
