const ordersPage = (() => {
    const fetchOrders = async () => {
        const userSession = sessionStorage.getItem('user');
        if (!userSession) {
            alert('You need to be logged in to view your orders.');
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(userSession);
        const username = user.username; // Get the username of the logged-in user

        try {
            const response = await fetch('https://casserolecoserver.glitch.me/orders'); // Fetch all orders from your backend
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const orders = await response.json();

            // Filter orders for the current user
            const userOrders = orders.filter(order => order.username === username);

            if (userOrders.length === 0) {
                document.getElementById('orders-list').innerHTML = '<p>No orders found.</p>';
                return;
            }

            // Sort orders by orderId (ascending)
            userOrders.sort((a, b) => a.orderId - b.orderId);

            // Render orders
            const ordersListContainer = document.getElementById('orders-list');
            ordersListContainer.innerHTML = userOrders.map(order => `
                <div class="order-item">
                    <h3>Order ID: ${order.id}</h3>
                    <p>Time: ${new Date(order.time).toLocaleString()}</p>
                    <p>Status: ${order.delivered ? 'Delivered' : 'In Progress'}</p>
                    <h4>Items:</h4>
                    <ul>
                        ${order.items.map(item => `
                            <li>
                                ${item.name} (x${item.quantity}) - ₹ ${(item.price * item.quantity).toFixed(2)}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Could not fetch your orders. Please try again later.');
        }
    };

    const init = async () => {
        await fetchOrders(); // Fetch and display orders when the page loads
    };

    return {
        init,
    };
})();

ordersPage.init();
