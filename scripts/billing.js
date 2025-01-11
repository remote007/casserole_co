import cart from './cart.js';

const renderCart = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const items = cart.getItems();

    cartItemsContainer.innerHTML = items.map(item => `
        <div class="cart-item">
            <table class="item-table">
                <tr class="item-row">
                    <td class="item-row-data"><span>${item.name}</span></td>
                    <td class="item-row-data"><span><input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="0"></span></td>
                    <td class="item-row-data"><span>₹ ${(item.price * item.quantity).toFixed(2)}</span></td>
                   </tr>
            </table>
        </div>
    `).join('');

    cartTotal.textContent = `₹ ${cart.getTotal().toFixed(2)}`;

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', () => {
            const itemId = parseInt(input.dataset.id);
            const quantity = parseInt(input.value);
            cart.updateItem(itemId, quantity);
            renderCart();
        });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.dataset.id);
            cart.removeItem(itemId);
            renderCart();
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('Order placed successfully!');
        cart.clear();
        renderCart();
    });
});
