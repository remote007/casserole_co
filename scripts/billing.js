import cart from './cart.js';

const billing = (() => {
    // Function to render the cart items
    const renderCart = async () => {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        // Fetch cart items with name and price
        const cartItems = await cart.getItems();
        if (cartItems.length === 0) {
            alert('Your cart is empty. Add dishes to proceed.');
            window.location.href = 'menu.html';
            return;
        }

        // Render the cart items
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

    // Function to place the order after payment success
    // const placeOrder = async () => {
    //     const userSession = sessionStorage.getItem('user');
    //     if (!userSession) {
    //         alert('You need to be logged in to place an order.');
    //         window.location.href = 'login.html?authType=customer';
    //         return;
    //     }

    //     const user = JSON.parse(userSession);
    //     const cartItems = await cart.getItems();

    //     if (cartItems.length === 0) {
    //         alert('Your cart is empty. Add items to place an order.');
    //         return;
    //     }

    //     const paymentStatus = sessionStorage.getItem('paymentStatus');
    //     if (paymentStatus == null) {
    //         window.location.href = 'payment.html'; // Redirect to payment page if payment failed
    //         return;
    //     }
    //     else if (paymentStatus !== 'success') {
    //         alert('Payment was not successful. Please try again.');
    //         window.location.href = 'payment.html'; // Redirect to payment page if payment failed
    //         return;
    //     }

    //     // Prepare order data
    //     const totalAmount = await cart.getTotal();
        
    //     // Fetch the existing orders to determine the length for the orderId
    //     let orderId;
    //     try {
    //         const ordersResponse = await fetch('https://casserolecoserver.glitch.me/orders');
    //         if (!ordersResponse.ok) {
    //             throw new Error('Failed to fetch orders');
    //         }
    //         const orders = await ordersResponse.json();
    //         orderId = orders.length + 1;  // Set orderId to the length of orders + 1
    //     } catch (error) {
    //         console.error('Error fetching existing orders:', error);
    //         alert('Could not fetch the current orders. Please try again later.');
    //         return;
    //     }

    //     // Prepare order data
    //     const order = {
    //         orderId: orderId,  // Set the orderId here
    //         username: user.username,
    //         items: cartItems.map(item => ({
    //             id: item.id,
    //             name: item.name,
    //             quantity: item.quantity,
    //             price: item.price
    //         })),
    //         time: new Date().toISOString(),
    //         delivered: false
    //     };

    //     // Send order to the server (Glitch endpoint)
    //     try {
    //         const response = await fetch('https://casserolecoserver.glitch.me/orders', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(order)
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to place the order. Please try again.');
    //         }

    //         alert('Order placed successfully!');
    //         await cart.clear(); // Clear the cart after successful order
    //         window.location.href = 'index.html'; // Redirect to homepage
    //     } catch (error) {
    //         console.error('Error placing the order:', error);
    //         alert('Could not place your order. Please try again later.');
    //     }
    // };

    const openPayment = async () => {
        window.location.href = 'payment.html';
    };

    const init = async () => {
        // Retrieve user data from sessionStorage
        const useremail = sessionStorage.getItem('user');
        if (!useremail) {
            alert('Login to view cart is logged in. Redirecting to login.');
            window.location.href = 'login.html?authType=customer';
            return;
        }

        // Render the cart
        await renderCart();

        // Checkout button logic
        // document.getElementById('checkout-btn').addEventListener('click', placeOrder);
        document.getElementById('checkout-btn').addEventListener('click', openPayment);

    };

    return {
        init,
        renderCart,
    };
})();

export default billing;
