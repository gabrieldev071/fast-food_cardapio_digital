document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os checkboxes e o carrinho de compras
    const checkboxes = document.querySelectorAll(".form-check-input");
    const cart = document.getElementById("cart");
    const totalElement = document.getElementById("total");
    
    let total = 0.00; // Inicializa o total do pedido

    // Atualiza o total exibido na página
    function updateTotal(amount) {
        total += amount;
        totalElement.innerText = `R$ ${total.toFixed(2)}`;
    }

    // Adiciona um item ao carrinho
    function addToCart(itemName, itemPrice, itemQuantity, itemId) {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        listItem.dataset.itemId = itemId;
        listItem.innerHTML = `
            ${itemName} 
            <span class="badge bg-primary rounded-pill">${itemQuantity}</span>
            <span>R$ ${(itemPrice * itemQuantity).toFixed(2)}</span>
        `;
        cart.appendChild(listItem);
    }

    // Remove um item do carrinho
    function removeFromCart(itemId, itemPrice, itemQuantity) {
        const itemToRemove = cart.querySelector(`[data-item-id="${itemId}"]`);
        if (itemToRemove) {
            cart.removeChild(itemToRemove);
            updateTotal(-itemPrice * itemQuantity);
        }
    }

    // Atualiza a quantidade de um item no carrinho
    function updateCartItem(itemId, itemPrice, newQuantity) {
        const cartItem = cart.querySelector(`[data-item-id="${itemId}"]`);
        if (cartItem) {
            const oldQuantity = parseInt(cartItem.querySelector('.badge').innerText);
            cartItem.querySelector('.badge').innerText = newQuantity;
            cartItem.querySelector('span:last-child').innerText = `R$ ${(itemPrice * newQuantity).toFixed(2)}`;
            updateTotal((newQuantity - oldQuantity) * itemPrice);
        }
    }

    // Adiciona eventos para todos os checkboxes
    checkboxes.forEach(checkbox => {
        const quantityInput = document.getElementById(`quantity${capitalize(checkbox.id)}`);

        checkbox.addEventListener("change", function () {
            const itemName = this.nextElementSibling.innerText;
            const itemPrice = parseFloat(this.value);
            const itemId = this.id;
            const itemQuantity = parseInt(quantityInput.value);

            if (this.checked) {
                addToCart(itemName, itemPrice, itemQuantity, itemId);
                updateTotal(itemPrice * itemQuantity);
            } else {
                removeFromCart(itemId, itemPrice, itemQuantity);
            }
        });

        quantityInput.addEventListener("change", function () {
            const itemPrice = parseFloat(checkbox.value);
            const itemId = checkbox.id;
            const newQuantity = parseInt(this.value);

            if (checkbox.checked) {
                updateCartItem(itemId, itemPrice, newQuantity);
            }
        });
    });

    // Abre o modal de finalização de pedido
    document.getElementById("checkout").addEventListener("click", function () {
        const orderSummary = document.getElementById("orderSummary");
        orderSummary.innerHTML = cart.innerHTML;
        document.getElementById("modalTotal").innerText = totalElement.innerText;

        const checkoutModal = new bootstrap.Modal(document.getElementById("checkoutModal"));
        checkoutModal.show();
    });

    // Função para capitalizar a primeira letra de uma string
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
