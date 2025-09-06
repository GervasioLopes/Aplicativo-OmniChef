// Arquivo: Aplicativo_OmniChef\src-pages\menu\index.js (VERSÃO FINAL CORRIGIDA)

document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================
    // DADOS E ESTADO DO APLICATIVO
    // ===================================
    
    const menuData = {
        porcoes: [
            { id: 1, name: 'FRANGO A PASSARINHO', price: 25.00, prepTime: 20, image: '../../../public/assets/images/Imagens/Frango-a-passarinho.jpg', description: 'Deliciosos pedaços de frango frito, crocantes por fora e macios por dentro.' },
            { id: 2, name: 'BATATA FRITA C/ CHEDDAR', price: 25.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Batata-frita-com-chedar.jpg', description: 'Porção generosa de batatas fritas cobertas com queijo cheddar cremoso e bacon.' },
            { id: 3, name: 'CALABRESA ACEBOLADA', price: 30.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Calabresa-acebolada.jpg', description: 'Linguiça calabresa fatiada e salteada com anéis de cebola dourada.' },
            { id: 4, name: 'DADINHO DE TAPIOCA', price: 25.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Dadinho-de-tapioca.jpeg', description: 'Cubos de tapioca com queijo coalho, acompanhados de geleia de pimenta.' },
            { id: 5, name: 'COXINHA 8 UNIDS', price: 20.00, prepTime: 15, image: '../../../public/assets/images/Imagens/Coxinha.jpg', description: 'Tradicionais coxinhas de frango cremosas e crocantes.' },
            { id: 6, name: 'KIBE 8 UNIDS', price: 35.00, prepTime: 18, image: '../../../public/assets/images/Imagens/Kibe.jpg', description: 'Kibes recheados com carne moída e especiarias, fritos na hora.' },
            { id: 7, name: 'ONION RINGS', price: 25.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Onion-rings.jpg', description: 'Anéis de cebola empanados e fritos, servidos com molho barbecue.' },
            { id: 8, name: 'PASTEL 6 UNIDS', price: 25.00, prepTime: 15, image: '../../../public/assets/images/Imagens/Pastel.jpg', description: 'Pastéis crocantes nos sabores carne, queijo e pizza.' },
            { id: 9, name: 'POLENTA FRITA', price: 20.00, prepTime: 18, image: '../../../public/assets/images/Imagens/Polenta-frita.jpg', description: 'Tiras de polenta frita crocantes, perfeitas para petiscar.' },
            { id: 10, name: 'SALADA DE BATATA C/ OVO', price: 16.00, prepTime: 14, image: '../../../public/assets/images/Imagens/Salada-batata-ovo.jpg', description: 'Salada de batata cremosa com ovos cozidos e maionese caseira.' },
            { id: 11, name: 'CARANGUEJO RECHEADO', price: 48.00, prepTime: 27, image: '../../../public/assets/images/Imagens/Caranguejo-recheado.jpg', description: 'Casquinha de caranguejo recheada com sua própria carne e temperos especiais.' },
        ],
        drinks: [
            { id: 101, name: 'COCA-COLA LATA 350ML', price: 8.00, prepTime: 1, image: '../../../public/assets/images/Imagens/Coca-cola-350.jpg', description: 'Coca-Cola gelada 350ml.' },
            { id: 102, name: 'SUCO DE LARANJA 500ML', price: 12.00, prepTime: 5, image: '../../../public/assets/images/Imagens/Suco-de-laranja-500.jpeg', description: 'Suco natural de laranja feito na hora.' },
            { id: 103, name: 'CAIPIRINHA DE LIMÃO', price: 18.00, prepTime: 7, image: '../../../public/assets/images/Imagens/Caipinha-de-limao-350.jpg', description: 'Tradicional caipirinha de cachaça com limão.' },
            { id: 104, name: 'ÁGUA MINERAL', price: 5.00, prepTime: 1, image: '../../../public/assets/images/Imagens/Agua-mineral-310.jpg', description: 'Água mineral sem gás 310ml.' },
            { id: 105, name: 'CERVEJA HEINEKEN', price: 14.00, prepTime: 1, image: '../../../public/assets/images/Imagens/Cerveja-h.jpg', description: 'Cerveja Heineken Long Neck.' },
        ],
        sobremesas: [
            { id: 201, name: 'PUDIM DE LEITE', price: 15.00, prepTime: 2, image: '../../../public/assets/images/Imagens/Pudim-de-leite.jpg', description: 'Cremoso pudim de leite condensado com calda de caramelo.' },
            { id: 202, name: 'MOUSSE DE MARACUJÁ', price: 13.00, prepTime: 2, image: '../../../public/assets/images/Imagens/Mousse-de-maracuja.jpg', description: 'Mousse aerado de maracujá com calda da fruta.' },
            { id: 203, name: 'BOLO DE CHOCOLATE', price: 16.00, prepTime: 2, image: '../../../public/assets/images/Imagens/Bolo-de-chocolate.jpg', description: 'Fatia de bolo de chocolate com cobertura cremosa.' },
        ]
    };
    
    let activeOrder = null;
    let selectedTable = null;

    // ===================================
    // SELEÇÃO DE ELEMENTOS DO DOM
    // ===================================
    
    const orderList = document.getElementById('order-list');
    const subtotalEl = document.getElementById('subtotal');
    const serviceTaxEl = document.getElementById('service-tax');
    const totalEl = document.getElementById('total');
    const cancelButton = document.querySelector('.btn-cancel');
    const submitButton = document.querySelector('.btn-submit');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.botao-pequisa');
    const openModalBtn = document.getElementById('open-modal-btn');
    const addDishModal = document.getElementById('add-dish-modal');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const addDishForm = document.getElementById('add-dish-form');
    const newOrderBtn = document.getElementById('new-order-btn');
    const tableSelectionModal = document.getElementById('table-selection-modal');
    const tablesGrid = document.getElementById('tables-grid');
    const startOrderBtn = document.getElementById('start-order-btn');
    const orderIdEl = document.getElementById('order-id');
    const tableNumberEl = document.getElementById('table-number');
    const clientCountEl = document.getElementById('client-count');
    const clientNumberInput = document.getElementById('client-number-input');

    // ===================================
    // FUNÇÕES PRINCIPAIS
    // ===================================

    const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;

    function renderMenuItem(item, targetGrid) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.description = item.description; 
        card.innerHTML = `<img src="${item.image}" alt="${item.name}"><div class="card-content"><h3>${item.name}</h3><div class="card-footer"><p class="price">PREÇO:${formatCurrency(item.price)}</p><div class="prep-time"><div class="prep-time-text"><span>Preparo</span><span>${item.prepTime} Min</span></div><i class="fa-solid fa-hourglass-half"></i></div></div></div>`;
        card.addEventListener('click', () => addToOrder(item));
        targetGrid.appendChild(card);
    }

    function addToOrder(itemToAdd) {
        if (!activeOrder) {
            alert('Por favor, inicie um novo pedido antes de adicionar pratos!');
            return;
        }
        const existingItem = activeOrder.items.find(item => item.id === itemToAdd.id);
        if (existingItem) { existingItem.quantity++; } 
        else { activeOrder.items.push({ ...itemToAdd, quantity: 1 }); }
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
                listItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-info">
                        <h4>${item.name}</h4>
                        <span class="price">${formatCurrency(item.price)}</span>
                    </div>
                    <div class="quantity-container">
                        <span>QUANTIDADE</span>
                        <div class="quantity-editor">
                            <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                        </div>
                    </div>`;
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
        if (!activeOrder || activeOrder.items.length === 0) {
            alert("Não há itens no pedido para cancelar.");
            return;
        }
        if (confirm("Você tem certeza que deseja cancelar o pedido e remover todos os itens?")) {
            activeOrder.items = [];
            renderOrderSummary();
            alert("Pedido cancelado com sucesso!");
        }
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeTabId = document.querySelector('.tab-button.active').dataset.target.replace('#', ''); 
        const itemsToSearch = menuData[activeTabId];
        const targetGrid = document.getElementById(`${activeTabId}-grid`);
        const filteredItems = itemsToSearch.filter(item => item.name.toLowerCase().includes(searchTerm));
        targetGrid.innerHTML = '';
        if (filteredItems.length === 0) {
            targetGrid.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">Nenhum item encontrado.</p>';
            return;
        }
        filteredItems.forEach(item => renderMenuItem(item, targetGrid));
    }

    function updateDateTime() {
        const now = new Date();
        const headerParagraph = document.querySelector('.paragrafo-botao p');
        if (headerParagraph) {
            headerParagraph.textContent = now.toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
    }
    
    function populateTables() {
        tablesGrid.innerHTML = '';
        for (let i = 1; i <= 6; i++) {
            const tableBtn = document.createElement('button');
            tableBtn.className = 'table-button';
            tableBtn.textContent = `Mesa ${i}`;
            tableBtn.dataset.tableId = i;
            tablesGrid.appendChild(tableBtn);
        }
    }

    // ===================================
    // EVENT LISTENERS E INICIALIZAÇÃO
    // ===================================

    newOrderBtn.addEventListener('click', () => {
        if (activeOrder) {
            if (!confirm('Já existe um pedido ativo. Deseja cancelar o pedido atual e iniciar um novo?')) {
                return;
            }
        }
        populateTables();
        selectedTable = null;
        clientNumberInput.value = 1; 
        tableSelectionModal.classList.remove('hidden');
    });

    tablesGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('table-button')) {
            const currentSelected = tablesGrid.querySelector('.selected');
            if (currentSelected) { currentSelected.classList.remove('selected'); }
            e.target.classList.add('selected');
            selectedTable = e.target.dataset.tableId;
        }
    });

    startOrderBtn.addEventListener('click', () => {
        const numberOfClients = parseInt(clientNumberInput.value, 10);

        if (!selectedTable) {
            alert('Por favor, selecione uma mesa.');
            return;
        }
        if (!numberOfClients || numberOfClients < 1) {
            alert('Por favor, insira um número de clientes válido.');
            return;
        }

        const newOrderId = Math.floor(Date.now() / 1000).toString().slice(-6);
        activeOrder = { id: newOrderId, table: selectedTable, items: [], clients: numberOfClients };
        
        orderIdEl.textContent = activeOrder.id;
        tableNumberEl.textContent = activeOrder.table;
        clientCountEl.textContent = activeOrder.clients;
        
        document.querySelectorAll('.items-grid').forEach(grid => grid.classList.remove('disabled'));
        renderOrderSummary();
        tableSelectionModal.classList.add('hidden');
    });

    openModalBtn.addEventListener('click', () => addDishModal.classList.remove('hidden'));
    cancelModalBtn.addEventListener('click', () => addDishModal.classList.add('hidden'));

    addDishForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const category = document.getElementById('dish-category').value;
        const allIds = [].concat(...Object.values(menuData)).map(i => i.id);
        const newId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
        const newDish = {
            id: newId,
            name: document.getElementById('dish-name').value.toUpperCase(),
            price: parseFloat(document.getElementById('dish-price').value),
            prepTime: parseInt(document.getElementById('dish-prep-time').value),
            image: document.getElementById('dish-image').value,
            description: document.getElementById('dish-description').value
        };
        menuData[category].push(newDish);
        const targetGrid = document.getElementById(`${category}-grid`);
        targetGrid.innerHTML = ''; 
        menuData[category].forEach(item => renderMenuItem(item, targetGrid));
        addDishForm.reset();
        addDishModal.classList.add('hidden');
    });

    orderList.addEventListener('click', (event) => {
        if (!activeOrder) return;
        const target = event.target;
        if (target.classList.contains('increase-btn')) {
            const itemId = parseInt(target.dataset.id);
            const itemToUpdate = activeOrder.items.find(item => item.id === itemId);
            if (itemToUpdate) { itemToUpdate.quantity++; renderOrderSummary(); }
        }
        if (target.classList.contains('decrease-btn')) {
            const itemId = parseInt(target.dataset.id);
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
    
    function initializeApp() {
        searchInput.value = '';
        document.querySelectorAll('.items-grid').forEach(grid => grid.classList.add('disabled'));
        Object.keys(menuData).forEach(category => {
            const items = menuData[category];
            const targetGrid = document.getElementById(`${category}-grid`);
            if(targetGrid) {
                targetGrid.innerHTML = '';
                items.forEach(item => renderMenuItem(item, targetGrid));
            }
        });
        renderOrderSummary();
        updateDateTime();
        setInterval(updateDateTime, 60000);
        cancelButton.addEventListener('click', cancelOrder);
        searchInput.addEventListener('input', handleSearch);
        searchButton.addEventListener('click', handleSearch);
        const tabButtons = document.querySelectorAll('.tab-button');
        const contentPanes = document.querySelectorAll('.content-pane');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                contentPanes.forEach(pane => pane.classList.remove('active'));
                button.classList.add('active');
                const targetPane = document.querySelector(button.dataset.target);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    initializeApp();

    // CONTROLE DO TOOLTIP GLOBAL
    const globalTooltip = document.getElementById('global-tooltip');
    if (globalTooltip) {
        document.querySelector('.cardapio-content').addEventListener('mouseover', (event) => {
            const card = event.target.closest('.item-card');
            if (!card) return;
            const description = card.dataset.description;
            if (!description) return;
            globalTooltip.textContent = description;
            globalTooltip.classList.remove('hidden');
            const cardRect = card.getBoundingClientRect();
            const tooltipRect = globalTooltip.getBoundingClientRect();
            let top = cardRect.top - tooltipRect.height - 8;
            let left = cardRect.left + (cardRect.width / 2) - (tooltipRect.width / 2);
            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth) {
                left = window.innerWidth - tooltipRect.width - 10;
            }
            globalTooltip.style.top = `${top}px`;
            globalTooltip.style.left = `${left}px`;
        });
        document.querySelector('.cardapio-content').addEventListener('mouseout', (event) => {
            const card = event.target.closest('.item-card');
            if (card) {
                globalTooltip.classList.add('hidden');
            }
        });
    }

    // LÓGICA PARA ENVIAR O PEDIDO
    submitButton.addEventListener('click', () => {
        if (!activeOrder || activeOrder.items.length === 0) {
            alert('Não há itens no pedido para enviar.');
            return;
        }

        activeOrder.timestamp = new Date().toISOString();
        activeOrder.status = 'aFazer';

        let allOrders = JSON.parse(localStorage.getItem('omniChefOrders')) || [];
        allOrders.push(activeOrder);
        localStorage.setItem('omniChefOrders', JSON.stringify(allOrders));

        alert(`Pedido #${activeOrder.id} enviado para a cozinha!`);
        
        activeOrder = null;
        
        orderIdEl.textContent = '--';
        tableNumberEl.textContent = '--';
        clientCountEl.textContent = '--';
        renderOrderSummary();
        document.querySelectorAll('.items-grid').forEach(grid => grid.classList.add('disabled'));

        window.location.href = '../pedidos/index.html';
    });

});
