
// ARQUIVO: menu/index.js (VERSÃO 8.0 - CORREÇÃO DAS ABAS DO CARDÁPIO)

import { db } from '../../../public/js/firebase-config.js';
import { doc, getDoc, collection, getDocs, addDoc, runTransaction, Timestamp, writeBatch, deleteDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================
    // VARIÁVEIS GLOBAIS
    // ===================================
    const localMenuData = {
        porcoes: [ { name: 'FRANGO A PASSARINHO', price: 25.00, prepTime: 20, image: '../../../public/assets/images/Imagens/Frango-a-passarinho.jpg', description: 'Deliciosos pedaços de frango frito, crocantes por fora e macios por dentro.' }, { name: 'BATATA FRITA C/ CHEDDAR', price: 25.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Batata-frita-com-chedar.jpg', description: 'Porção generosa de batatas fritas cobertas com queijo cheddar cremoso e bacon.' }, { name: 'CALABRESA ACEBOLADA', price: 30.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Calabresa-acebolada.jpg', description: 'Linguiça calabresa fatiada e salteada com anéis de cebola dourada.' }, { name: 'DADINHO DE TAPIOCA', price: 25.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Dadinho-de-tapioca.jpeg', description: 'Cubos de tapioca com queijo coalho, acompanhados de geleia de pimenta.' }, { name: 'COXINHA 8 UNIDS', price: 20.00, prepTime: 15, image: '../../../public/assets/images/Imagens/Coxinha.jpg', description: 'Tradicionais coxinhas de frango cremosas e crocantes.' }, { name: 'KIBE 8 UNIDS', price: 35.00, prepTime: 18, image: '../../../public/assets/images/Imagens/Kibe.jpg', description: 'Kibes recheados com carne moída e especiarias, fritos na hora.' }, { name: 'ONION RINGS', price: 25.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Onion-rings.jpg', description: 'Anéis de cebola empanados e fritos, servidos com molho barbecue.' }, { name: 'PASTEL 6 UNIDS', price: 25.00, prepTime: 15, image: '../../../public/assets/images/Imagens/Pastel.jpg', description: 'Pastéis crocantes nos sabores carne, queijo e pizza.' }, { name: 'POLENTA FRITA', price: 20.00, prepTime: 18, image: '../../../public/assets/images/Imagens/Polenta-frita.jpg', description: 'Tiras de polenta frita crocantes, perfeitas para petiscar.' }, { name: 'SALADA DE BATATA C/ OVO', price: 16.00, prepTime: 14, image: '../../../public/assets/images/Imagens/Salada-batata-ovo.jpg', description: 'Salada de batata cremosa com ovos cozidos e maionese caseira.' }, { name: 'CARANGUEJO RECHEADO', price: 48.00, prepTime: 27, image: '../../../public/assets/images/Imagens/Caranguejo-recheado.jpg', description: 'Casquinha de caranguejo recheada com sua própria carne e temperos especiais.' }, ],
        drinks: [ { name: 'COCA-COLA LATA 350ML', price: 8.00, prepTime: 1, image: '../../../public/assets/images/Imagens/Coca-cola-350.jpg', description: 'Coca-Cola gelada 350ml.' }, { name: 'SUCO DE LARANJA 500ML', price: 12.00, prepTime: 5, image: '../../../public/assets/images/Imagens/Suco-de-laranja-500.jpeg', description: 'Suco natural de laranja feito na hora.' }, { name: 'CAIPIRINHA DE LIMÃO', price: 18.00, prepTime: 7, image: '../../../public/assets/images/Imagens/Caipinha-de-limao-350.jpg', description: 'Tradicional caipirinha de cachaça com limão.' }, { name: 'ÁGUA MINERAL', price: 5.00, prepTime: 1, image: '../../../public/assets/images/Imagens/Agua-mineral-310.jpg', description: 'Água mineral sem gás 310ml.' }, { name: 'CERVEJA HEINEKEN', price: 14.00, prepTime: 1, image: '../../../public/assets/images/Imagens/Cerveja-h.jpg', description: 'Cerveja Heineken Long Neck.' }, ],
        sobremesas: [ { name: 'PUDIM DE LEITE', price: 15.00, prepTime: 2, image: '../../../public/assets/images/Imagens/Pudim-de-leite.jpg', description: 'Cremoso pudim de leite condensado com calda de caramelo.' }, { name: 'MOUSSE DE MARACUJÁ', price: 13.00, prepTime: 2, image: '../../../public/assets/images/Imagens/Mousse-de-maracuja.jpg', description: 'Mousse aerado de maracujá com calda da fruta.' }, { name: 'BOLO DE CHOCOLATE', price: 16.00, prepTime: 2, image: '../../../public/assets/images/Imagens/Bolo-de-chocolate.jpg', description: 'Fatia de bolo de chocolate com cobertura cremosa.' }, ]
    };
    
    let liveMenuData = { porcoes: [], drinks: [], sobremesas: [] };
    let activeOrder = null;
    let selectedTable = null;

    // Seleção de Elementos do DOM
    const cardapioContent = document.querySelector('.cardapio-content');
    const globalTooltip = document.getElementById('global-tooltip'); 
    const orderList = document.getElementById('order-list');
    const subtotalEl = document.getElementById('subtotal');
    const serviceTaxEl = document.getElementById('service-tax');
    const totalEl = document.getElementById('total');
    const cancelButton = document.querySelector('.btn-cancel');
    const submitButton = document.querySelector('.btn-submit');
    const newOrderBtn = document.getElementById('new-order-btn');
    const tableSelectionModal = document.getElementById('table-selection-modal');
    const tablesGrid = document.getElementById('tables-grid');
    const startOrderBtn = document.getElementById('start-order-btn');
    const orderIdEl = document.getElementById('order-id');
    const tableNumberEl = document.getElementById('table-number');
    const clientCountEl = document.getElementById('client-count');
    const clientNumberInput = document.getElementById('client-number-input');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.botao-pequisa');
    const openModalBtn = document.getElementById('open-modal-btn');
    const addDishModal = document.getElementById('add-dish-modal');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const addDishForm = document.getElementById('add-dish-form');


    // ===================================
    // FUNÇÕES DO CARDÁPIO (FIREBASE)
    // ===================================
    async function seedMenuToFirebase() {
        const porcoesRef = collection(db, 'menuItems', 'porcoes', 'items');
        const porcoesSnapshot = await getDocs(porcoesRef);
        if (porcoesSnapshot.empty) {
            console.log("Banco de dados de cardápio vazio. Populando agora...");
            const batch = writeBatch(db);
            Object.keys(localMenuData).forEach(category => {
                localMenuData[category].forEach(item => {
                    const { id, ...itemData } = item; 
                    const newItemRef = doc(collection(db, 'menuItems', category, 'items'));
                    batch.set(newItemRef, itemData);
                });
            });
            await batch.commit();
            console.log("Cardápio populado com sucesso!");
        }
    }
    
    async function loadMenuFromFirebase() {
        const categories = ['porcoes', 'drinks', 'sobremesas'];
        liveMenuData = { porcoes: [], drinks: [], sobremesas: [] };
        for (const category of categories) {
            const itemsCollectionRef = collection(db, 'menuItems', category, 'items');
            const querySnapshot = await getDocs(itemsCollectionRef);
            querySnapshot.forEach((doc) => {
                liveMenuData[category].push({ id: doc.id, category: category, ...doc.data() });
            });
        }
        renderAllCategories();
    }
    
    function renderAllCategories() {
        Object.keys(liveMenuData).forEach(category => {
            const targetGrid = document.getElementById(`${category}-grid`);
            if (targetGrid) {
                targetGrid.innerHTML = '';
                if (liveMenuData[category].length === 0) {
                    targetGrid.innerHTML = `<p class="empty-category-msg">Nenhum item cadastrado.</p>`;
                } else {
                    liveMenuData[category].forEach(item => renderMenuItem(item, targetGrid));
                }
            }
        });
    }

    addDishForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const category = document.getElementById('dish-category').value;
        const newDish = {
            name: document.getElementById('dish-name').value.toUpperCase(),
            price: parseFloat(document.getElementById('dish-price').value),
            prepTime: parseInt(document.getElementById('dish-prep-time').value),
            image: document.getElementById('dish-image').value,
            description: document.getElementById('dish-description').value
        };
        try {
            const itemsCollectionRef = collection(db, 'menuItems', category, 'items');
            await addDoc(itemsCollectionRef, newDish);
            alert('Prato adicionado com sucesso!');
            addDishForm.reset();
            addDishModal.classList.add('hidden');
            loadMenuFromFirebase();
        } catch (error) {
            console.error("Erro ao adicionar prato no Firebase:", error);
            alert("Ocorreu um erro ao adicionar o prato.");
        }
    });

    // ===================================
    // FUNÇÕES DE PEDIDOS E UI
    // ===================================
    
    async function populateTables() {
        tablesGrid.innerHTML = '<p>Carregando mesas...</p>';
        try {
            const configDoc = await getDoc(doc(db, "saloonConfig", "main"));
            const totalTables = configDoc.exists() ? configDoc.data().totalTables : 6;
            const tablesSnapshot = await getDocs(collection(db, "tables"));
            const tablesData = [];
            tablesSnapshot.forEach(doc => {
                tablesData.push({ id: parseInt(doc.id), ...doc.data() });
            });
            tablesGrid.innerHTML = '';
            for (let i = 1; i <= totalTables; i++) {
                const tableBtn = document.createElement('button');
                tableBtn.className = 'table-button';
                tableBtn.textContent = `Mesa ${i}`;
                tableBtn.dataset.tableId = i;
                const tableInfo = tablesData.find(t => t.id === i);
                const status = tableInfo ? tableInfo.status : 'livre';
                if (status !== 'livre') {
                    tableBtn.classList.add('disabled');
                    tableBtn.disabled = true;
                    tableBtn.title = `Mesa ${i} está ${status === 'ocupada' ? 'Ocupada' : 'Reservada'}`;
                }
                tablesGrid.appendChild(tableBtn);
            }
        } catch (error) {
            console.error("Erro ao carregar mesas:", error);
            tablesGrid.innerHTML = '<p>Erro ao carregar mesas. Tente novamente.</p>';
        }
    }

    submitButton.addEventListener('click', async () => {
        if (!activeOrder || activeOrder.items.length === 0) {
            alert('Não há itens no pedido para enviar.');
            return;
        }
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        try {
            const { id, ...orderContent } = activeOrder;
            const orderData = { ...orderContent, localId: id, status: 'aFazer', timestamp: Timestamp.now() };
            await addDoc(collection(db, "orders"), orderData);
            const tableRef = doc(db, "tables", activeOrder.table);
            await runTransaction(db, async (transaction) => {
                const tableDoc = await transaction.get(tableRef);
                if (!tableDoc.exists()) {
                    transaction.set(tableRef, { status: 'ocupada', clients: activeOrder.clients, orders: [orderData] });
                } else {
                    const currentData = tableDoc.data();
                    const newOrders = currentData.orders ? [...currentData.orders, orderData] : [orderData];
                    transaction.update(tableRef, { status: 'ocupada', clients: activeOrder.clients, orders: newOrders });
                }
            });
            alert(`Pedido #${activeOrder.id} enviado para a cozinha!`);
            activeOrder = null;
            orderIdEl.textContent = '--';
            tableNumberEl.textContent = '--';
            clientCountEl.textContent = '--';
            renderOrderSummary();
            window.location.href = '../controle-mesas/index.html';
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            alert("Ocorreu um erro ao enviar o pedido.");
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Pedido';
        }
    });

    const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;
    
    function updateDateTime() {
        const now = new Date();
        const datetimeEl = document.querySelector('.paragrafo-botao p');
        if (datetimeEl) {
            datetimeEl.textContent = now.toLocaleString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        }
    }

    function renderMenuItem(item, targetGrid) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.id = item.id;
        card.dataset.category = item.category;
        card.dataset.description = item.description;

        card.innerHTML = `
            <button class="btn-delete-item" data-id="${item.id}" data-category="${item.category}" data-name="${item.name}" title="Remover ${item.name}">
                <i class="fas fa-trash-alt"></i>
            </button>
            <img src="${item.image}" alt="${item.name}">
            <div class="card-content">
                <h3>${item.name}</h3>
                <div class="card-footer">
                    <p class="price">PREÇO:${formatCurrency(item.price)}</p>
                    <div class="prep-time">
                        <div class="prep-time-text"><span>Preparo</span><span>${item.prepTime} Min</span></div>
                        <i class="fa-solid fa-hourglass-half"></i>
                    </div>
                </div>
            </div>`;
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete-item')) return;
            addToOrder(item);
        });
        targetGrid.appendChild(card);
    }

    function addToOrder(itemToAdd) {
        if (!activeOrder) {
            alert('Por favor, inicie um novo pedido antes de adicionar pratos!');
            return;
        }
        const existingItem = activeOrder.items.find(item => item.id === itemToAdd.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            activeOrder.items.push({ ...itemToAdd, quantity: 1 });
        }
        renderOrderSummary();
    }

    function renderOrderSummary() {
        orderList.innerHTML = '';
        if (!activeOrder || activeOrder.items.length === 0) {
            orderList.innerHTML = '<p style="text-align: center; color: #888;">Nenhum item no pedido.</p>';
        } else {
            activeOrder.items.forEach(item => {
                const listItem = document.createElement('div');
                listItem.className = 'order-item';
                listItem.innerHTML = `<img src="${item.image}" alt="${item.name}"><div class="order-item-info"><h4>${item.name}</h4><span class="price">${formatCurrency(item.price)}</span></div><div class="quantity-container"><span>QUANTIDADE</span><div class="quantity-editor"><button class="quantity-btn decrease-btn" data-id="${item.id}">-</button><span class="quantity-value">${item.quantity}</span><button class="quantity-btn increase-btn" data-id="${item.id}">+</button></div></div>`;
                orderList.appendChild(listItem);
            });
        }
        updateTotals();
    }

    function updateTotals() {
        if (!activeOrder) {
            subtotalEl.textContent = formatCurrency(0);
            serviceTaxEl.textContent = formatCurrency(0);
            totalEl.textContent = formatCurrency(0);
            return;
        }
        const subtotal = activeOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const serviceTax = subtotal * 0.10;
        const total = subtotal + serviceTax;
        subtotalEl.textContent = formatCurrency(subtotal);
        serviceTaxEl.textContent = formatCurrency(serviceTax);
        totalEl.textContent = formatCurrency(total);
    }
    
    function cancelOrder() {
        if (activeOrder && activeOrder.items.length > 0 && confirm("Deseja cancelar o pedido atual?")) {
            activeOrder.items = [];
            renderOrderSummary();
        }
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeTabId = document.querySelector('.tab-button.active')?.dataset.target.replace('#', '');
        if (!activeTabId) return;
        const itemsToSearch = liveMenuData[activeTabId];
        const targetGrid = document.getElementById(`${activeTabId}-grid`);
        const filteredItems = itemsToSearch.filter(item => item.name.toLowerCase().includes(searchTerm));
        targetGrid.innerHTML = '';
        if (filteredItems.length === 0) {
            targetGrid.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">Nenhum item encontrado.</p>';
        } else {
            filteredItems.forEach(item => renderMenuItem(item, targetGrid));
        }
    }

    // ===================================
    // EVENT LISTENERS E INICIALIZAÇÃO
    // ===================================
    
    cardapioContent.addEventListener('click', async (event) => {
        const deleteButton = event.target.closest('.btn-delete-item');
        if (!deleteButton) return;
        const itemId = deleteButton.dataset.id;
        const category = deleteButton.dataset.category;
        const itemName = deleteButton.dataset.name;
        if (confirm(`Tem certeza que deseja remover "${itemName}" do cardápio permanentemente?`)) {
            try {
                const itemRef = doc(db, 'menuItems', category, 'items', itemId);
                await deleteDoc(itemRef);
                alert(`"${itemName}" foi removido com sucesso.`);
                loadMenuFromFirebase();
            } catch (error) {
                console.error("Erro ao remover o item:", error);
                alert("Ocorreu um erro ao remover o item.");
            }
        }
    });

    newOrderBtn.addEventListener('click', () => {
        if (activeOrder) {
            if (!confirm('Já existe um pedido ativo. Deseja cancelar e iniciar um novo?')) return;
        }
        populateTables();
        selectedTable = null;
        clientNumberInput.value = 1;
        tableSelectionModal.classList.remove('hidden');
    });

    tablesGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('table-button') && !e.target.disabled) {
            const currentSelected = tablesGrid.querySelector('.selected');
            if (currentSelected) currentSelected.classList.remove('selected');
            e.target.classList.add('selected');
            selectedTable = e.target.dataset.tableId;
        }
    });

    startOrderBtn.addEventListener('click', () => {
        const clients = parseInt(clientNumberInput.value);
        if (!selectedTable || !clients || clients < 1) {
            alert('Por favor, selecione uma mesa e insira um número de clientes válido.');
            return;
        }
        const tempId = Date.now().toString().slice(-6);
        activeOrder = { id: tempId, table: selectedTable, clients: clients, items: [] };
        orderIdEl.textContent = tempId;
        tableNumberEl.textContent = selectedTable;
        clientCountEl.textContent = clients;
        renderOrderSummary();
        tableSelectionModal.classList.add('hidden');
    });

    orderList.addEventListener('click', (event) => {
        if (!activeOrder) return;
        const target = event.target;
        if (target.classList.contains('increase-btn')) {
            const itemId = target.dataset.id;
            const itemToUpdate = activeOrder.items.find(item => item.id === itemId);
            if (itemToUpdate) { itemToUpdate.quantity++; renderOrderSummary(); }
        }
        if (target.classList.contains('decrease-btn')) {
            const itemId = target.dataset.id;
            const itemToUpdate = activeOrder.items.find(item => item.id === itemId);
            if (itemToUpdate) {
                itemToUpdate.quantity--;
                if (itemToUpdate.quantity === 0) {
                    activeOrder.items = activeOrder.items.filter(item => item.id !== itemId);
                }
                renderOrderSummary();
            }
        }
    });
    
    cancelButton.addEventListener('click', cancelOrder);
    searchInput.addEventListener('input', handleSearch);
    searchButton.addEventListener('click', handleSearch);
    openModalBtn.addEventListener('click', () => addDishModal.classList.remove('hidden'));
    cancelModalBtn.addEventListener('click', () => addDishModal.classList.add('hidden'));

    if (globalTooltip && cardapioContent) {
        cardapioContent.addEventListener('mouseover', (event) => {
            const card = event.target.closest('.item-card');
            if (!card) return;
            const description = card.dataset.description;
            if (!description) return;
            globalTooltip.textContent = description;
            globalTooltip.classList.remove('hidden');
            const cardRect = card.getBoundingClientRect();
            let top = cardRect.top - globalTooltip.offsetHeight - 10;
            let left = cardRect.left + (cardRect.width / 2) - (globalTooltip.offsetWidth / 2);
            if (top < 10) { top = cardRect.bottom + 10; }
            if (left < 10) { left = 10; }
            if (left + globalTooltip.offsetWidth > window.innerWidth) {
                left = window.innerWidth - globalTooltip.offsetWidth - 10;
            }
            globalTooltip.style.top = `${top + window.scrollY}px`;
            globalTooltip.style.left = `${left + window.scrollX}px`;
        });
        cardapioContent.addEventListener('mouseout', (event) => {
            const card = event.target.closest('.item-card');
            if (card) {
                globalTooltip.classList.add('hidden');
            }
        });
    }

    async function initializeApp() {
        renderOrderSummary();
        updateDateTime();
        setInterval(updateDateTime, 60000);
        // await seedMenuToFirebase();
        await loadMenuFromFirebase();
        
        // **LÓGICA DAS ABAS REINSERIDA ABAIXO**
        const tabButtons = document.querySelectorAll('.tab-button');
        const contentPanes = document.querySelectorAll('.content-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove a classe 'active' de todos os botões e painéis
                tabButtons.forEach(btn => btn.classList.remove('active'));
                contentPanes.forEach(pane => pane.classList.remove('active'));

                // Adiciona a classe 'active' ao botão clicado e ao painel correspondente
                button.classList.add('active');
                const targetPane = document.querySelector(button.dataset.target);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    initializeApp();
});