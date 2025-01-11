// const ordersPage = (() => {
//     const fetchOrders = async () => {
//         const userSession = sessionStorage.getItem('user');
//         if (!userSession) {
//             alert('You need to be logged in to view your orders.');
//             window.location.href = 'login.html';
//             return;
//         }

//         const user = JSON.parse(userSession);
//         const username = user.username; // Get the username of the logged-in user

//         try {
//             const response = await fetch('https://casserolecoserver.glitch.me/orders'); // Fetch all orders from your backend
//             if (!response.ok) {
//                 throw new Error('Failed to fetch orders');
//             }

//             const orders = await response.json();

//             // Filter orders for the current user
//             const userOrders = orders.filter(order => order.username === username);

//             if (userOrders.length === 0) {
//                 document.getElementById('orders-list').innerHTML = '<p>No orders found.</p>';
//                 return;
//             }

//             // Sort orders by orderId (ascending)
//             userOrders.sort((a, b) => b.orderId - a.orderId);

//             // Render orders
//             const ordersListContainer = document.getElementById('orders-list');
//             ordersListContainer.innerHTML = userOrders.map(order => `
//                 <div class="order-item">
//                     <h3>Order ID: ${order.id}</h3>
//                     <p>Time: ${new Date(order.time).toLocaleString()}</p>
//                     <p>Status: ${order.delivered ? 'Delivered' : 'In Progress'}</p>
//                     <h4>Items:</h4>
//                     <ul>
//                         ${order.items.map(item => `
//                             <li>
//                                 ${item.name} (x${item.quantity}) - ₹ ${(item.price * item.quantity).toFixed(2)}
//                             </li>
//                         `).join('')}
//                     </ul>
//                 </div>
//             `).join('');
//         } catch (error) {
//             console.error('Error fetching orders:', error);
//             alert('Could not fetch your orders. Please try again later.');
//         }
//     };

//     const init = async () => {
//         await fetchOrders(); // Fetch and display orders when the page loads
//     };

//     return {
//         init,
//     };
// })();

// ordersPage.init();

const ordersPage = (() => {
    // Helper function to calculate remaining time
    const getRemainingTime = (orderTime) => {
        const currentTime = new Date();
        const timeDiff = orderTime - currentTime;

        // Check if the order is already delivered
        if (timeDiff <= 0) {
            return 'Order Delivered';
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
                    delivered: true, // Set the order as delivered
                    status: 'Delivered', // Update status to 'Delivered'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update delivery status');
            }

            const updatedOrder = await response.json();
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

            // Sort orders by orderId (descending order)
            userOrders.sort((a, b) => new Date(b.time) - new Date(a.time));

            // Render orders
            const ordersListContainer = document.getElementById('orders-list');
            ordersListContainer.innerHTML = '';  // Clear previous orders
            userOrders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order');

                const orderTime = new Date(order.time);
                const deliveredTime = order.delivered ? 'Delivered' : 'Pending';
                const remainingTime = getRemainingTime(orderTime);

                // Display order details
                orderDiv.innerHTML = `
                    <h3>Order Placed: ${orderTime.toLocaleString()}</h3>
                    <p>Status: ${deliveredTime}</p>
                    <p>Remaining Time: ${remainingTime}</p>
                    <ul>
                        ${order.items.map(item => `
                            <li>
                                ${item.name} (x${item.quantity}) - ₹ ${(item.price * item.quantity).toFixed(2)}
                            </li>
                        `).join('')}
                    </ul>
                `;

                // Append the order div to the orders list container
                ordersListContainer.appendChild(orderDiv);

                // Check if the order has been placed for more than 30 minutes and is not delivered
                const currentTime = new Date();
                const timeDiff = currentTime - orderTime;
                const thirtyMinutesInMs = 30 * 60 * 1000; // 30 minutes in milliseconds

                // If the order is not delivered and has passed 30 minutes, update the status
                if (!order.delivered && timeDiff >= thirtyMinutesInMs) {
                    updateDeliveryStatus(order.orderId); // Update delivery status to "delivered"
                }
            });
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

