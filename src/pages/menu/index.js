document.addEventListener('DOMContentLoaded', () => {
    // ---- DADOS DOS ITENS DO MENU ----
    const menuItems = [
        { id: 1, name: 'FRANGO A PASSARINHO', price: 25.00, prepTime: 20, image: '../../../public/assets/images/Imagens/Frango-a-passarinho.jpg' },
        { id: 2, name: 'BATATA FRITA C/ CHEDDAR', price: 25.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Batata-frita-com-chedar.jpg' },
        { id: 3, name: 'CALABRESA ACEBOLADA', price: 30.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Calabresa-acebolada.jpg' },
        { id: 4, name: 'DADINHO DE TAPIOCA', price: 25.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Dadinho-de-tapioca.jpeg' },
        { id: 5, name: 'COXINHA 8 UNIDS', price: 20.00, prepTime: 15, image: '../../../public/assets/images/Imagens/Coxinha.jpg' },
        { id: 6, name: 'KIBE 8 UNIDS', price: 35.00, prepTime: 18, image: '../../../public/assets/images/Imagens/Kibe.jpg' },
        { id: 7, name: 'ONION RINGS', price: 25.00, prepTime: 10, image: '../../../public/assets/images/Imagens/Onion-rings.jpg' },
        { id: 8, name: 'PASTEL 6 UNIDS', price: 25.00, prepTime: 15, image: '../../../public/assets/images/Imagens/Pastel.jpg' },
        { id: 9, name: 'POLENTA FRITA', price: 20.00, prepTime: 18, image: '../../../public/assets/images/Imagens/Polenta-frita.jpg' },
        { id: 10, name: 'SALADA DE BATATA C/ OVO', price: 16.00, prepTime: 14, image: '../../../public/assets/images/Imagens/Salada-batata-ovo.jpg' },
        { id: 11, name: 'CARANGUEJO RECHEADO', price: 48.00, prepTime: 27, image: '../../../public/assets/images/Imagens/Caranguejo-recheado.jpg' },
    ];
    
    // ---- ESTADO DO PEDIDO ATUAL ----
    let currentOrder = [];

    // ---- ELEMENTOS DO DOM ----
    const itemsGrid = document.getElementById('items-grid');
    const orderList = document.getElementById('order-list');
    const subtotalEl = document.getElementById('subtotal');
    const serviceTaxEl = document.getElementById('service-tax');
    const totalEl = document.getElementById('total');
    const currentDateEl = document.getElementById('current-date');
    const cancelButton = document.querySelector('.btn-cancel');
    const searchInput = document.querySelector('.search-input'); // --- ADICIONADO ---
    const searchButton = document.querySelector('.botao-pequisa'); // --- ADICIONADO ---

    // ---- FUNÇÕES ----
    const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`;

    // --- FUNÇÃO MODIFICADA ---
    function renderMenuItems(itemsToRender) {
        itemsGrid.innerHTML = '';
        if (itemsToRender.length === 0) {
            itemsGrid.innerHTML = '<p style="text-align: center; color: #888888ff; width: 100%;">Nenhum prato encontrado.</p>';
            return;
        }
        itemsToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <div class="card-footer">
                        <p class="price">PREÇO:${formatCurrency(item.price)}</p>
                        <div class="prep-time">
                            <div class="prep-time-text">
                                <span>Preparo</span>
                                <span>${item.prepTime} Min</span>
                            </div>
                            <i class="fa-solid fa-hourglass-half"></i>
                        </div>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => addToOrder(item));
            itemsGrid.appendChild(card);
        });
    }

    function addToOrder(itemToAdd) {
        const existingItem = currentOrder.find(item => item.id === itemToAdd.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            currentOrder.push({ ...itemToAdd, quantity: 1 });
        }
        renderOrderSummary();
    }

    function renderOrderSummary() {
        orderList.innerHTML = '';
        if (currentOrder.length === 0) {
            orderList.innerHTML = '<p style="text-align: center; color: #888;">Nenhum item no pedido.</p>';
        } else {
            currentOrder.forEach(item => {
                const listItem = document.createElement('div');
                listItem.className = 'order-item';
                listItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-info">
                        <h4>${item.name}</h4>
                        <span class="price">${formatCurrency(item.price)}</span>
                    </div>
                    <div class="quantity">
                        <span>QUANTIDADE</span>
                        <span class="quantity-value">${item.quantity}</span>
                    </div>
                `;
                orderList.appendChild(listItem);
            });
        }
        updateTotals();
    }

    function updateTotals() {
        const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const serviceTax = subtotal * 0.10;
        const total = subtotal + serviceTax;
        subtotalEl.textContent = formatCurrency(subtotal);
        serviceTaxEl.textContent = formatCurrency(serviceTax);
        totalEl.textContent = formatCurrency(total);
    }
    
    function removeLastAddedItem() {
        if (currentOrder.length === 0) return;
        const lastItem = currentOrder[currentOrder.length - 1];
        lastItem.quantity--;
        if (lastItem.quantity === 0) {
            currentOrder.pop();
        }
        renderOrderSummary();
    }

    // --- FUNÇÃO ADICIONADA ---
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredItems = menuItems.filter(item => {
            return item.name.toLowerCase().includes(searchTerm);
        });
        renderMenuItems(filteredItems);
    }

    function updateDateTime() {
        const now = new Date();
        const headerParagraph = document.querySelector('.paragrafo-botao p');
        if (headerParagraph) {
            headerParagraph.textContent = now.toLocaleString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        }
    }

    // ---- INICIALIZAÇÃO ----
    renderMenuItems(menuItems); // --- MODIFICADO ---
    renderOrderSummary();
    updateDateTime();
    setInterval(updateDateTime, 60000);
    cancelButton.addEventListener('click', removeLastAddedItem);
    
    // --- EVENTOS ADICIONADOS ---
    searchInput.addEventListener('input', handleSearch);
    searchButton.addEventListener('click', handleSearch);
});