import cart from './cart.js';

const billing = (() => {
    const renderCart = async () => {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        // Fetch cart items with name and price
        const cartItems = await cart.getItems();
        if (cartItems.length  == 0) {
            alert('Your cart is empty. Add dishes to proceed.');
            window.location.href = 'menu.html';
            return;
        }

        // Render the cart items
        console.log(cartItems);
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item">
                <table class="item-table">
                    <tr class="item-row">
                        <td class="item-row-data"><span>${item.name}</span></td>
                        <td class="item-row-data">
                            <span>
                                <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="0">
                            </span>
                        </td>
                        <td class="item-row-data"><span>₹ ${(item.price * item.quantity).toFixed(2)}</span></td>
                    </tr>
                </table>
            </div>
        `).join('');

        // Calculate and display the cart total
        const total = await cart.getTotal();
        cartTotal.textContent = `₹ ${total.toFixed(2)}`;

        // Event listener for quantity change
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', async () => {
                const itemId = parseInt(input.dataset.id);
                const quantity = parseInt(input.value);

                if (isNaN(quantity) || quantity < 0) {
                    alert('Please enter a valid quantity.');
                    renderCart();
                    return;
                }

                await cart.updateItem(itemId, quantity);
                renderCart();
            });
        });
    };

    const init = async () => {
        // Retrieve user data from sessionStorage
        const userSession = sessionStorage.getItem('user');
        if (!userSession) {
            alert('No user is logged in. Redirecting to login.');
            window.location.href = 'login.html';
            return;
        }

        // Render the cart
        await renderCart();

        // Checkout button logic
        document.getElementById('checkout-btn').addEventListener('click', async () => {
            alert('Order placed successfully!');
            await cart.clear();  // Clear the cart after successful order
            window.location.href = 'index.html';  // Redirect to the homepage
        });
    };

    return {
        init,
        renderCart,
    };
})();

export default billing;
