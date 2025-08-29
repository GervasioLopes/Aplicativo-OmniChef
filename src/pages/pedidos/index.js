document.addEventListener('DOMContentLoaded', () => {
    // ---- DADOS DOS ITENS DO MENU ----
    const menuItems = [
        { id: 1, name: 'FRANGO A PASSARINHO', price: 25.00, prepTime: 20, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Frango-a-passarinho.jpg' },
        { id: 2, name: 'BATATA FRITA C/ CHEDDAR', price: 25.00, prepTime: 10, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Batata-frita-com-chedar.jpg' },
        { id: 3, name: 'CALABRESA ACEBOLADA', price: 30.00, prepTime: 10, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Calabresa-acebolada.jpg' },
        { id: 4, name: 'DADINHO DE TAPIOCA', price: 25.00, prepTime: 10, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Dadinho-de-tapioca.jpeg' },
        { id: 5, name: 'COXINHA 8 UNIDS', price: 20.00, prepTime: 15, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Coxinha.jpg' },
        { id: 6, name: 'KIBE 8 UNIDS', price: 35.00, prepTime: 18, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Kibe.jpg' },
        { id: 7, name: 'ONION RINGS', price: 25.00, prepTime: 10, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Onion-rings.jpg' },
        { id: 8, name: 'PASTEL 6 UNIDS', price: 25.00, prepTime: 15, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Pastel.jpg' },
        { id: 9, name: 'POLENTA FRITA', price: 20.00, prepTime: 18, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Polenta-frita.jpg' },
        { id: 9, name: 'SALADA DE BATATA C/ OVO', price: 16.00, prepTime: 14, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Salada-batata-ovo.jpg' },
        { id: 9, name: 'CARANGUEJO RECHEADO', price: 48.00, prepTime: 27, image: '/Aplicativo_OmniChef/public/assets/images/Imagens/Caranguejo-recheado.jpg' },
    ];
    

    // ---- ESTADO DO PEDIDO ATUAL ----
    let currentOrder = []; /*Uma arrays vazia que serve para guardar os itens selecionados pelo cliente ou seja, e um carrinho de compra*/ 

    // ---- ELEMENTOS DO DOM ----
    const itemsGrid = document.getElementById('items-grid'); // "Procure na página HTML inteira pelo elemento com id="items-grid" e guarde-o na constante chamada itemsGrid".
    const orderList = document.getElementById('order-list'); // "Procure na página HTML inteira pelo elemento com id="order-list" e guarde-o na constante chamada orderList".
    const subtotalEl = document.getElementById('subtotal'); // "Procure na página HTML inteira pelo elemento com id="subtotal" e guarde-o na constante chamada subtotalEl".
    const serviceTaxEl = document.getElementById('service-tax'); // "Procure na página HTML inteira pelo elemento com id="service-tax" e guarde-o na constante chamada serviceTaxEl".
    const totalEl = document.getElementById('total'); // "Procure na página HTML inteira pelo elemento com id="total" e guarde-o na constante chamada totalEl".
    const currentDateEl = document.getElementById('current-date'); // "Procure na página HTML inteira pelo elemento com id="current-date" e guarde-o na constante chamada currentDateEl".

    // ---- FUNÇÕES ----

    // Função para formatar moeda
    const formatCurrency = (value) => `R$${value.toFixed(2).replace('.', ',')}`; // Define uma função que tem como objetivo principal pegar um número (por exemplo, 50.25) e transformá-lo em uma string formatada como valor monetário brasileiro (R$50,25).

     // Função para renderizar os itens do menu na tela
    function renderMenuItems() 
    {
        itemsGrid.innerHTML = '';
        menuItems.forEach(item => 
        {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="price">PREÇO: ${formatCurrency(item.price)}</p>
                <p class="prep-time"><i class="fas fa-clock"></i> Preparo ${item.prepTime} Min</p>
            `;
            // Adiciona o evento de clique para adicionar ao pedido
            card.addEventListener('click', () => addToOrder(item));
            itemsGrid.appendChild(card);
        });
    }
     // Função para adicionar um item ao pedido
    function addToOrder(itemToAdd) 
    {
        // Verifica se o item já está no pedido
        const existingItem = currentOrder.find(item => item.id === itemToAdd.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            currentOrder.push({ ...itemToAdd, quantity: 1 });
        }

        renderOrderSummary();
    }

    // Função para renderizar o resumo do pedido
    // Função para renderizar o resumo do pedido (VERSÃO CORRIGIDA)
function renderOrderSummary() {
    orderList.innerHTML = '';
    if (currentOrder.length === 0) {
        orderList.innerHTML = '<p style="text-align: center; color: #888;">Nenhum item no pedido.</p>';
    } else {
        currentOrder.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'order-item';
            
            // A mágica acontece aqui!
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

    // Função para atualizar os totais
    function updateTotals() 
    {
        const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const serviceTax = subtotal * 0.10;
        const total = subtotal + serviceTax;

        subtotalEl.textContent = formatCurrency(subtotal);
        serviceTaxEl.textContent = formatCurrency(serviceTax);
        totalEl.textContent = formatCurrency(total);
    }
    
    // Função para atualizar a data e hora
    function updateDateTime() 
    {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        currentDateEl.textContent = new Intl.DateTimeFormat('pt-BR', options).format(now);
    }

    // ---- INICIALIZAÇÃO ----
    renderMenuItems();
    renderOrderSummary(); // Para exibir a mensagem inicial
    updateDateTime();
    setInterval(updateDateTime, 60000); // Atualiza a cada minuto
});