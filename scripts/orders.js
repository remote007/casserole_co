// const ordersPage = (() => {
//     // Helper function to calculate remaining time
//     const getRemainingTime = (orderTime) => {
//         const currentTime = new Date();
//         const thirtyMinutesAfterOrder = new Date(orderTime.getTime() + 30 * 60 * 1000);
//         const timeDiff = thirtyMinutesAfterOrder - currentTime;

//         if (timeDiff <= 0) {
//             return null; // Return null if 30 minutes have passed
//         }

//         const minutesRemaining = Math.floor(timeDiff / (1000 * 60));
//         const secondsRemaining = Math.floor((timeDiff % (1000 * 60)) / 1000);

//         return `${minutesRemaining} mins & ${secondsRemaining} secs`;
//     };

//     // Function to update delivery status
//     const updateDeliveryStatus = async (orderId) => {
//         try {
//             const response = await fetch(`https://casserolecoserver.glitch.me/orders/${orderId}`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     delivered: true,
//                     status: 'Delivered',
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to update delivery status');
//             }

//             console.log(`Order ID ${orderId} status updated to Delivered.`);
//         } catch (error) {
//             console.error('Error updating delivery status:', error);
//         }
//     };

//     const fetchOrders = async () => {
//         const useremail = sessionStorage.getItem('user');
        
//         if (!useremail) {
//             alert('You need to log in to view your orders.');
//             window.location.href = 'login.html';
//             return;
//         }

//         try {
//             const response = await fetch('https://casserolecoserver.glitch.me/orders');
//             // https://casserolecoserver.glitch.me/orders?email=useremail
//             if (!response.ok) {
//                 throw new Error('Failed to fetch orders');
//             }

//             const orders = await response.json();
//             const userOrders = orders.filter(order => order.email === useremail);
//             if (userOrders.length === 0) {
//                 document.getElementById('orders-list').innerHTML = '<p>No orders found.</p>';
//                 return;
//             }

//             userOrders.sort((a, b) => new Date(b.time) - new Date(a.time));

//             const ordersListContainer = document.getElementById('orders-list');
//             ordersListContainer.innerHTML = ''; // Clear previous orders

//             userOrders.forEach(order => {
//                 const orderDiv = document.createElement('div');
//                 orderDiv.classList.add('order-item');
//                 orderDiv.style.border = '1px solid #ddd';
//                 orderDiv.style.borderRadius = '8px';
//                 orderDiv.style.padding = '16px';
//                 orderDiv.style.marginBottom = '16px';
//                 orderDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

//                 const orderTime = new Date(order.time);
//                 const deliveredTime = order.delivered ? 'Delivered' : 'Pending';
//                 const remainingTime = getRemainingTime(orderTime);

//                 // Order Header
//                 const orderHeader = document.createElement('h3');
//                 orderHeader.textContent = `Order ID: ${order.id}`;
//                 orderHeader.style.marginBottom = '8px';
//                 orderHeader.style.color = '#333';

//                 const orderDate = document.createElement('p');
//                 orderDate.textContent = `Placed on: ${orderTime.toLocaleString()}`;
//                 orderDate.style.color = '#555';
//                 orderDate.style.fontSize = '14px';
//                 orderDate.style.marginBottom = '8px';

//                 const orderStatus = document.createElement('p');
//                 orderStatus.textContent = `Status: ${deliveredTime}`;
//                 orderStatus.style.color = order.delivered ? 'green' : 'orange';
//                 orderStatus.style.fontWeight = 'bold';
//                 orderStatus.style.marginBottom = '8px';

//                 orderDiv.appendChild(orderHeader);
//                 orderDiv.appendChild(orderDate);
//                 orderDiv.appendChild(orderStatus);

//                 // Remaining time with sand timer animation
//                 if (!order.delivered && remainingTime) {
//                     const timerContainer = document.createElement('div');
//                     timerContainer.style.display = 'flex';
//                     timerContainer.style.alignItems = 'center';
//                     timerContainer.style.marginTop = '8px';

//                     // Sand timer container
//                     const sandTimer = document.createElement('div');
//                     sandTimer.style.width = '40px';
//                     sandTimer.style.height = '60px';
//                     sandTimer.style.position = 'relative';
//                     sandTimer.style.border = '2px solid #000';
//                     sandTimer.style.borderRadius = '8px';
//                     sandTimer.style.marginRight = '12px';
//                     sandTimer.style.overflow = 'hidden';

//                     // Top sand
//                     const topSand = document.createElement('div');
//                     topSand.style.width = '100%';
//                     topSand.style.height = '50%';
//                     topSand.style.backgroundColor = '#ffb74d';
//                     topSand.style.position = 'absolute';
//                     topSand.style.top = '0';
//                     topSand.style.transition = 'height 1s linear';

//                     // Falling sand animation
//                     const fallingSand = document.createElement('div');
//                     fallingSand.style.width = '10px';
//                     fallingSand.style.height = '10px';
//                     fallingSand.style.backgroundColor = '#ffb74d';
//                     fallingSand.style.position = 'absolute';
//                     fallingSand.style.top = '50%';
//                     fallingSand.style.left = '50%';
//                     fallingSand.style.transform = 'translate(-50%, -50%)';
//                     fallingSand.style.animation = 'falling 1s infinite linear';

//                     // Bottom sand
//                     const bottomSand = document.createElement('div');
//                     bottomSand.style.width = '100%';
//                     bottomSand.style.height = '0';
//                     bottomSand.style.backgroundColor = '#ffb74d';
//                     bottomSand.style.position = 'absolute';
//                     bottomSand.style.bottom = '0';
//                     bottomSand.style.transition = 'height 1s linear';

//                     sandTimer.appendChild(topSand);
//                     sandTimer.appendChild(fallingSand);
//                     sandTimer.appendChild(bottomSand);

//                     // Remaining time text
//                     const remainingTimeText = document.createElement('span');
//                     remainingTimeText.textContent = remainingTime;
//                     remainingTimeText.style.color = '#ff5722';
//                     remainingTimeText.style.fontWeight = 'bold';

//                     timerContainer.appendChild(sandTimer);
//                     timerContainer.appendChild(remainingTimeText);

//                     orderDiv.appendChild(timerContainer);

//                     // Update the sand timer and remaining time every second
//                     const intervalId = setInterval(() => {
//                         const updatedRemainingTime = getRemainingTime(orderTime);
//                         if (updatedRemainingTime) {
//                             remainingTimeText.textContent = updatedRemainingTime;

//                             // Simulate sand movement
//                             const totalSeconds = 30 * 60;
//                             const elapsedSeconds =
//                                 (new Date().getTime() - orderTime.getTime()) / 1000;
//                             const topSandHeight = Math.max(
//                                 0,
//                                 50 - (50 * elapsedSeconds) / totalSeconds
//                             );
//                             const bottomSandHeight = Math.min(
//                                 50,
//                                 (50 * elapsedSeconds) / totalSeconds
//                             );

//                             topSand.style.height = `${topSandHeight}%`;
//                             bottomSand.style.height = `${bottomSandHeight}%`;
//                         } else {
//                             remainingTimeText.textContent = 'Delivered';
//                             sandTimer.style.display = 'none';
//                             clearInterval(intervalId);
//                         }
//                     }, 1000);
//                 }

//                 // Items list
//                 const itemsHeader = document.createElement('h4');
//                 itemsHeader.textContent = 'Items:';
//                 itemsHeader.style.marginBottom = '8px';
//                 itemsHeader.style.color = '#444';

//                 const itemsList = document.createElement('ul');
//                 itemsList.style.listStyleType = 'none';
//                 itemsList.style.padding = '0';
//                 itemsList.style.margin = '0';

//                 order.items.forEach(item => {
//                     const itemLi = document.createElement('li');
//                     itemLi.textContent = `${item.name} (x${item.quantity}) - ₹ ${(item.price * item.quantity).toFixed(2)}`;
//                     itemLi.style.marginBottom = '4px';
//                     itemLi.style.color = '#555';
//                     itemsList.appendChild(itemLi);
//                 });

//                 orderDiv.appendChild(itemsHeader);
//                 orderDiv.appendChild(itemsList);
//                 const ordertotal = document.createElement('h4');
//                 ordertotal.style.left = '100%';;
//                 ordertotal.textContent = `Total : ${order.total}`;

//                 orderDiv.appendChild(ordertotal);

//                 // Append the order div to the orders list container
//                 ordersListContainer.appendChild(orderDiv);

//                 // Check if 30 minutes have passed
//                 if (!order.delivered && new Date() - orderTime >= 30 * 60 * 1000) {
//                     updateDeliveryStatus(order.id);
//                 }
//             });
//         } catch (error) {
//             console.error('Error fetching orders:', error);
//             alert('Could not fetch your orders. Please try again later.');
//         }
//     };

//     const init = async () => {
//         const userSession = sessionStorage.getItem('user');
//         if (!userSession) {
//             alert('You need to log in to view your orders. Redirecting to login.');
//             window.location.href = 'login.html';
//             return;
//         }
//         await fetchOrders();
//     };

//     return {
//         init,
//     };
// })();

// ordersPage.init();

const ordersPage = (() => {
    const createStarRating = (orderId) => {
        const ratingContainer = document.createElement('div');
        ratingContainer.style.display = 'flex';
        ratingContainer.style.alignItems = 'center';
        ratingContainer.style.marginTop = '10px';

        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.style.cursor = 'pointer';
            star.style.fontSize = '20px';
            star.style.color = 'gray';
            star.style.marginRight = '5px';

            star.addEventListener('click', () => {
                // Highlight stars up to clicked one
                stars.forEach((s, index) => {
                    s.style.color = index < i ? 'gold' : 'gray';
                });

                // Store rating in sessionStorage or API call
                sessionStorage.setItem(`rating-${orderId}`, i);
            });

            stars.push(star);
            ratingContainer.appendChild(star);
        }
        return ratingContainer;
    };

    const createReviewBox = (orderId) => {
        const reviewContainer = document.createElement('div');
        reviewContainer.style.marginTop = '10px';

        const textArea = document.createElement('textarea');
        textArea.placeholder = 'Write your review here...';
        textArea.style.width = '100%';
        textArea.style.height = '80px';
        textArea.style.borderRadius = '5px';
        textArea.style.border = '1px solid #ccc';
        textArea.style.padding = '10px';
        textArea.style.marginBottom = '10px';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Review';
        submitButton.style.padding = '10px 20px';
        submitButton.style.borderRadius = '5px';
        submitButton.style.border = 'none';
        submitButton.style.backgroundColor = '#28a745';
        submitButton.style.color = 'white';
        submitButton.style.cursor = 'pointer';

        submitButton.addEventListener('click', () => {
            const reviewText = textArea.value.trim();
            if (reviewText) {
                alert(`Review for Order ${orderId}: ${reviewText}`);
                sessionStorage.setItem(`review-${orderId}`, reviewText);
                textArea.value = '';
            } else {
                alert('Please write a review before submitting.');
            }
        });

        reviewContainer.appendChild(textArea);
        reviewContainer.appendChild(submitButton);
        return reviewContainer;
    };

    const fetchOrders = async () => {
        const useremail = sessionStorage.getItem('user');
        if (!useremail) {
            alert('You need to log in to view your orders.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('https://casserolecoserver.glitch.me/orders');
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const orders = await response.json();
            const userOrders = orders.filter(order => order.email === useremail);
            console.log(userOrders);
            const ordersContainer = document.getElementsByClassName('orders-container')[0];
            ordersContainer.innerHTML = '';

            userOrders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.style.border = '1px solid #ddd';
                orderDiv.style.borderRadius = '8px';
                orderDiv.style.padding = '16px';
                orderDiv.style.marginBottom = '16px';
                orderDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

                // Order details
                const orderHeader = document.createElement('h3');
                orderHeader.textContent = `Order ID: ${order.id}`;
                orderHeader.style.marginBottom = '8px';

                const orderDate = document.createElement('p');
                orderDate.textContent = `Placed on: ${new Date(order.time).toLocaleString()}`;
                orderDate.style.marginBottom = '8px';

                const orderStatus = document.createElement('p');
                orderStatus.textContent = `Status: ${order.delivered ? 'Delivered' : 'Pending'}`;
                orderStatus.style.color = order.delivered ? 'green' : 'orange';
                orderStatus.style.marginBottom = '8px';

                // Items list
                const itemsList = document.createElement('ul');
                itemsList.style.listStyleType = 'none';
                itemsList.style.padding = '0';
                order.items.forEach(item => {
                    const itemLi = document.createElement('li');
                    itemLi.textContent = `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`;
                    itemLi.style.marginBottom = '4px';
                    itemsList.appendChild(itemLi);
                });

                const orderTotal = document.createElement('h4');
                orderTotal.textContent = `Total: ₹${order.total}`;
                orderTotal.style.marginTop = '10px';

                // Append elements to the orderDiv
                orderDiv.appendChild(orderHeader);
                orderDiv.appendChild(orderDate);
                orderDiv.appendChild(orderStatus);
                orderDiv.appendChild(itemsList);
                orderDiv.appendChild(orderTotal);

                // Add rating and review if delivered
                if (order.delivered) {
                    const rating = createStarRating(order.id);
                    const reviewBox = createReviewBox(order.id);
                    orderDiv.appendChild(rating);
                    orderDiv.appendChild(reviewBox);
                }

                // Append orderDiv to ordersContainer
                ordersContainer.appendChild(orderDiv);
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Could not fetch your orders. Please try again later.');
        }
    };

    const init = async () => {
        const userSession = sessionStorage.getItem('user');
        if (!userSession) {
            alert('You need to log in to view your orders.');
            window.location.href = 'login.html';
            return;
        }
        await fetchOrders();
    };

    return {
        init,
    };
})();

// Initialize orders page
ordersPage.init();
