const ordersPage = (() => {
    // Helper function to calculate remaining time
    const getRemainingTime = (orderTime) => {
        const currentTime = new Date();
        const timeDiff = orderTime - currentTime;

        if (timeDiff <= 0) {
            return null; // Return null if the order is delivered
        }

        const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hoursRemaining} hours and ${minutesRemaining} minutes remaining`;
    };

    // Function to update delivery status if more than 30 minutes passed
    const updateDeliveryStatus = async (orderId) => {
        try {
            const response = await fetch(`https://casserolecoserver.glitch.me/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    delivered: true,
                    status: 'Delivered',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update delivery status');
            }

            console.log(`Order ID ${orderId} status updated to Delivered.`);
        } catch (error) {
            console.error('Error updating delivery status:', error);
        }
    };

    const fetchOrders = async () => {
        const userSession = sessionStorage.getItem('user');
        if (!userSession) {
            alert('You need to be logged in to view your orders.');
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(userSession);
        const username = user.username;

        try {
            const response = await fetch('https://casserolecoserver.glitch.me/orders');
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

            // Sort orders by orderId (descending order)
            userOrders.sort((a, b) => new Date(b.time) - new Date(a.time));

            // Render orders with styled DOM elements
            const ordersListContainer = document.getElementById('orders-list');
            ordersListContainer.innerHTML = ''; // Clear previous orders

            userOrders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order-item');
                orderDiv.style.border = '1px solid #ddd';
                orderDiv.style.borderRadius = '8px';
                orderDiv.style.padding = '16px';
                orderDiv.style.marginBottom = '16px';
                orderDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

                const orderTime = new Date(order.time);
                const deliveredTime = order.delivered ? 'Delivered' : 'Pending';
                const remainingTime = getRemainingTime(orderTime);

                // Order Header
                const orderHeader = document.createElement('h3');
                orderHeader.textContent = `Order ID: ${order.id}`;
                orderHeader.style.marginBottom = '8px';
                orderHeader.style.color = '#333';

                const orderDate = document.createElement('p');
                orderDate.textContent = `Placed on: ${orderTime.toLocaleString()}`;
                orderDate.style.color = '#555';
                orderDate.style.fontSize = '14px';
                orderDate.style.marginBottom = '8px';

                const orderStatus = document.createElement('p');
                orderStatus.textContent = `Status: ${deliveredTime}`;
                orderStatus.style.color = order.delivered ? 'green' : 'orange';
                orderStatus.style.fontWeight = 'bold';
                orderStatus.style.marginBottom = '8px';

                orderDiv.appendChild(orderHeader);
                orderDiv.appendChild(orderDate);
                orderDiv.appendChild(orderStatus);

                // Remaining time (if applicable)
                if (!order.delivered && remainingTime) {
                    const remainingTimeParagraph = document.createElement('p');
                    remainingTimeParagraph.textContent = `Remaining Time: ${remainingTime}`;
                    remainingTimeParagraph.style.color = '#ff5722';
                    remainingTimeParagraph.style.marginBottom = '16px';
                    orderDiv.appendChild(remainingTimeParagraph);
                }

                // Items list
                const itemsHeader = document.createElement('h4');
                itemsHeader.textContent = 'Items:';
                itemsHeader.style.marginBottom = '8px';
                itemsHeader.style.color = '#444';

                const itemsList = document.createElement('ul');
                itemsList.style.listStyleType = 'none';
                itemsList.style.padding = '0';
                itemsList.style.margin = '0';

                order.items.forEach(item => {
                    const itemLi = document.createElement('li');
                    itemLi.textContent = `${item.name} (x${item.quantity}) - ₹ ${(item.price * item.quantity).toFixed(2)}`;
                    itemLi.style.marginBottom = '4px';
                    itemLi.style.color = '#555';
                    itemsList.appendChild(itemLi);
                });

                orderDiv.appendChild(itemsHeader);
                orderDiv.appendChild(itemsList);

                // Append the order div to the orders list container
                ordersListContainer.appendChild(orderDiv);

                // Check if the order has been placed for more than 30 minutes and is not delivered
                const currentTime = new Date();
                const timeDiff = currentTime - orderTime;
                const thirtyMinutesInMs = 30 * 60 * 1000;

                if (!order.delivered && timeDiff >= thirtyMinutesInMs) {
                    updateDeliveryStatus(order.orderId);
                }
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Could not fetch your orders. Please try again later.');
        }
    };

    const init = async () => {
        const userSession = sessionStorage.getItem('user');
        if (!userSession) {
            alert('You need to log in to view your orders. Redirecting to login.');
            window.location.href = 'login.html';
            return;
        }
        await fetchOrders();
    };

    return {
        init,
    };
})();

ordersPage.init();
