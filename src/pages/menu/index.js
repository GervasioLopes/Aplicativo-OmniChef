// Aguarda o HTML ser completamente carregado para então executar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================
    // DADOS E ESTADO DO APLICATIVO
    // ===================================
    
    const menuItems = [
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
    ];
    
    let activeOrder = null;
    let selectedTable = null;

    // ===================================
    // SELEÇÃO DE ELEMENTOS DO DOM
    // ===================================
    const itemsGridContainer = document.getElementById('items-grid');
    const orderList = document.getElementById('order-list');
    const subtotalEl = document.getElementById('subtotal');
    const serviceTaxEl = document.getElementById('service-tax');
    const totalEl = document.getElementById('total');
    const cancelButton = document.querySelector('.btn-cancel');
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

    // ===================================
    // FUNÇÕES PRINCIPAIS
    // ===================================

    const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;

    function renderMenuItems(itemsToRender) {
        itemsGridContainer.innerHTML = '';
        if (!itemsToRender || itemsToRender.length === 0) {
            itemsGridContainer.innerHTML = '<p style="text-align: center; color: #888; width: 100%;">Nenhum prato encontrado.</p>';
            return;
        }
        itemsToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `<div class="tooltip">${item.description}</div><img src="${item.image}" alt="${item.name}"><div class="card-content"><h3>${item.name}</h3><div class="card-footer"><p class="price">PREÇO:${formatCurrency(item.price)}</p><div class="prep-time"><div class="prep-time-text"><span>Preparo</span><span>${item.prepTime} Min</span></div><i class="fa-solid fa-hourglass-half"></i></div></div></div>`;
            card.addEventListener('click', () => addToOrder(item));
            itemsGridContainer.appendChild(card);
        });
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

    /** Renderiza a lista de itens no resumo do pedido, agora com o texto "QUANTIDADE" restaurado. */
    function renderOrderSummary() {
        orderList.innerHTML = '';
        if (!activeOrder || activeOrder.items.length === 0) {
            orderList.innerHTML = '<p style="text-align: center; color: #888;">Nenhum item no pedido.</p>';
        } else {
            activeOrder.items.forEach(item => {
                const listItem = document.createElement('div');
                listItem.className = 'order-item';
                // =========================================================================
                // CORREÇÃO: Bloco de Quantidade atualizado para incluir o texto "QUANTIDADE"
                // =========================================================================
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
        const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(searchTerm));
        renderMenuItems(filteredItems);
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
        if (!selectedTable) {
            alert('Por favor, selecione uma mesa para iniciar o pedido.');
            return;
        }
        const newOrderId = Math.floor(Date.now() / 1000).toString().slice(-6);
        activeOrder = { id: newOrderId, table: selectedTable, items: [] };
        
        orderIdEl.textContent = activeOrder.id;
        tableNumberEl.textContent = activeOrder.table;
        itemsGridContainer.classList.remove('disabled');
        renderOrderSummary();
        tableSelectionModal.classList.add('hidden');
    });

    openModalBtn.addEventListener('click', () => addDishModal.classList.remove('hidden'));
    cancelModalBtn.addEventListener('click', () => addDishModal.classList.add('hidden'));

    addDishForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newDish = {
            id: menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1,
            name: document.getElementById('dish-name').value.toUpperCase(),
            price: parseFloat(document.getElementById('dish-price').value),
            prepTime: parseInt(document.getElementById('dish-prep-time').value),
            image: document.getElementById('dish-image').value,
            description: document.getElementById('dish-description').value
        };
        menuItems.push(newDish);
        renderMenuItems(menuItems);
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
        itemsGridContainer.classList.add('disabled');
        renderMenuItems(menuItems);
        renderOrderSummary();
        updateDateTime();
        setInterval(updateDateTime, 60000);
        
        cancelButton.addEventListener('click', cancelOrder);
        searchInput.addEventListener('input', handleSearch);
        searchButton.addEventListener('click', handleSearch);
    }

    initializeApp();
});