// const ordersPage = (() => {

//     const deliveryDuration = 60 * 60 * 1000; // 1 hour in milliseconds

//     const calculateRemainingTime = (orderTime) => {
//         const currentTime = new Date().getTime();
//         const elapsedTime = currentTime - new Date(orderTime).getTime();
//         const remainingTime = deliveryDuration - elapsedTime;
//         return remainingTime > 0 ? remainingTime : 0;
//     };

//     const updateDeliveryStatus = async (orderId) => {
//         try {
//             const response = await fetch(`https://casserolecoserver.glitch.me/orders/${orderId}`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ delivered: true }),
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to update delivery status');
//             }
//         } catch (error) {
//             console.error('Error updating delivery status:', error);
//         }
//     };

//     const createStarRating = (orderId, existingRating) => {
//         const ratingContainer = document.createElement('div');
//         ratingContainer.style.display = 'flex';
//         ratingContainer.style.alignItems = 'center';
//         ratingContainer.style.justifyContent = 'center';
//         ratingContainer.style.marginTop = '15px';

//         const stars = [];
//         for (let i = 1; i <= 5; i++) {
//             const star = document.createElement('span');
//             star.textContent = '★';
//             star.style.cursor =  existingRating ? 'default' : 'pointer';
//             star.style.fontSize = '24px';
//             star.style.color = i <= (existingRating || 0) ?'#FFC107' : 'rgba(255, 215, 0, 0.5)'; // Subtle golden glow
//             star.style.marginRight = '8px';
//             star.style.transition = 'color 0.3s ease';

//             if (!existingRating) {
//                 star.addEventListener('click', () => {
//                     stars.forEach((s, index) => {
//                         s.style.color = index < i ? '#FFC107' : '#D1B280';
//                     });
//                     ratingContainer.dataset.rating = i; // Store rating for submission
//                 });
//             }

//             stars.push(star);
//             ratingContainer.appendChild(star);
//         }
//         return ratingContainer;
//     };

//     const createReviewBox = (orderId, existingReview) => {
//         const reviewContainer = document.createElement('div');
//         reviewContainer.style.marginTop = '15px';

//         if (existingReview) {
//             const reviewText = document.createElement('p');
//             reviewText.textContent = `Review: ${existingReview}`;
//             reviewText.style.marginTop = '5px';
//             reviewText.style.padding = '10px';
//             reviewText.style.background = 'rgba(245, 229, 209, 0.8)';
//             reviewText.style.borderRadius = '8px';
//             reviewText.style.border = '1px solid rgba(225, 202, 171, 0.8)';
//             reviewText.style.color = '#6C4F3D';
//             reviewText.style.fontFamily = '"Poppins", sans-serif';
//             reviewText.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//             reviewContainer.appendChild(reviewText);
//         } 

//         else{
//         const textArea = document.createElement('textarea');
//         textArea.placeholder = 'Share your experience...';
//         textArea.style.width = '100%';
//         textArea.style.height = '100px';
//         textArea.style.borderRadius = '12px';
//         textArea.style.border = 'none';
//         textArea.style.padding = '15px';
//         textArea.style.background = 'rgba(255, 255, 255, 0.6)'; // Glass-like transparency
//         textArea.style.backdropFilter = 'blur(8px)';
//         textArea.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
//         textArea.style.fontFamily = 'Arial, sans-serif';
//         textArea.style.fontSize = '14px';
//         textArea.style.marginBottom = '12px';
//         textArea.style.color = '#3e2723'; // Dark brown
//         textArea.style.outline = 'none';

//         const submitButton = document.createElement('button');
//         submitButton.textContent = 'Submit Review';
//         submitButton.style.padding = '12px 20px';
//         submitButton.style.borderRadius = '8px';
//         submitButton.style.border = 'none';
//         submitButton.style.background = 'rgba(212, 175, 55, 0.85)'; // Golden honey
//         submitButton.style.color = '#fff';
//         submitButton.style.cursor = 'pointer';
//         submitButton.style.fontWeight = 'bold';
//         submitButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
//         submitButton.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
        
//         submitButton.addEventListener('mouseover', () => {
//             submitButton.style.background = 'rgba(184, 134, 11, 0.9)'; // Deeper golden
//             submitButton.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
//         });
//         submitButton.addEventListener('mouseout', () => {
//             submitButton.style.background = 'rgba(212, 175, 55, 0.85)';
//             submitButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
//         });

//         submitButton.addEventListener('click', async () => {
//                             const reviewText = textArea.value.trim();
//                             const rating = reviewContainer.previousElementSibling.dataset.rating;
            
//                             if (!rating || !reviewText) {
//                                 alert('Please provide a rating and review before submitting.');
//                                 return;
//                             }
            
//                             try {
//                                 const response = await fetch(`https://casserolecoserver.glitch.me/orders/${orderId}`, {
//                                     method: 'PATCH',
//                                     headers: { 'Content-Type': 'application/json' },
//                                     body: JSON.stringify({ rating: parseInt(rating, 10), review: reviewText }),
//                                 });
            
//                                 if (!response.ok) {
//                                     throw new Error('Failed to submit review');
//                                 }
            
//                                 alert('Thank you for your review!');
//                                 location.reload(); // Refresh to display the saved review
//                             } catch (error) {
//                                 console.error('Error submitting review:', error);
//                                 alert('Failed to submit your review. Please try again later.');
//                             }
//                         });

//         reviewContainer.appendChild(textArea);
//         reviewContainer.appendChild(submitButton);
//     }
//         return reviewContainer;
//     };

//     const fetchOrders = async () => {
//         const useremail = sessionStorage.getItem('user');
//         if (!useremail) {
//             alert('You need to log in to view your orders.');
//             window.location.href = 'login.html?authType=customer';
//             return;
//         }

//         try {
//             const response = await fetch('https://casserolecoserver.glitch.me/orders');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch orders');
//             }

//             const orders = await response.json();
//             const userOrders = orders.filter(order => order.email === useremail);
//             const ordersContainer = document.getElementsByClassName('orders-container')[0];
//             ordersContainer.innerHTML = '';
//             userOrders.sort((a, b) => new Date(b.time) - new Date(a.time));
//             userOrders.forEach(order => {
//                 const orderDiv = document.createElement('div');
//                 orderDiv.style.borderRadius = '15px';
//                 orderDiv.style.margin = "auto";
//                 orderDiv.style.padding = '20px';
//                 orderDiv.style.marginBottom = '20px';
//                 orderDiv.style.background = 'rgba(255, 255, 255, 0.5)'; // Glass-like effect
//                 orderDiv.style.backdropFilter = 'blur(10px)';
//                 orderDiv.style.boxShadow = '0 8px 16px rgba(188, 166, 2, 0.93)';
//                 orderDiv.style.fontFamily = 'Arial, sans-serif';
//                 orderDiv.style.color = 'black'; // Dark brown
//                 orderDiv.style.transition = 'transform 0.2s ease';
//                 orderDiv.style.width = "70%";

//                 orderDiv.addEventListener('mouseover', () => {
//                     orderDiv.style.transform = 'scale(1.02)';
//                 });
//                 orderDiv.addEventListener('mouseout', () => {
//                     orderDiv.style.transform = 'scale(1)';
//                 });

//                 // Order details
//                 const orderHeader = document.createElement('h3');
//                 orderHeader.textContent = `Order ID: ${order.id}`;
//                 orderHeader.style.marginBottom = '12px';
//                 orderHeader.style.color = '#black'; // Deeper golden

//                 const orderDate = document.createElement('p');
//                 orderDate.textContent = `Placed on: ${new Date(order.time).toLocaleString()}`;
//                 orderDate.style.marginBottom = '12px';

//                 const remainingTime = calculateRemainingTime(order.time);
//                 const timeText = remainingTime > 0
//                     ? `Time Remaining: ${Math.ceil(remainingTime / 60000)} mins`
//                     : -1;

//                 const timeRemaining = document.createElement('p');
//                 timeRemaining.textContent = timeText;
//                 timeRemaining.style.color = remainingTime > 0 ? 'darkbrown' : 'red';
//                 timeRemaining.style.marginBottom = '12px';

//                 const orderStatus = document.createElement('p');
//                 orderStatus.textContent = `Status: ${order.delivered ? 'Delivered' : 'Pending'}`;
//                 orderStatus.style.color = order.delivered ? 'dark-green' : 'red'; // Delivered green, pending burnt orange
//                 orderStatus.style.marginBottom = '12px';

//                 if (!order.delivered && remainingTime <= 0) {
//                     orderStatus.textContent = 'Status: Delivered';
//                     orderStatus.style.color = '#3c763d';
//                     updateDeliveryStatus(order.id);
//                 }

//                 // Items list
//                 const itemsList = document.createElement('ul');
//                 itemsList.style.listStyleType = 'none';
//                 itemsList.style.padding = '0';
//                 order.items.forEach(item => {
//                     const itemLi = document.createElement('li');
//                     itemLi.textContent = `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`;
//                     itemLi.style.marginBottom = '6px';
//                     itemsList.appendChild(itemLi);
//                 });

//                 const orderTotal = document.createElement('h4');
//                 orderTotal.textContent = `Total: ₹${order.total}`;
//                 orderTotal.style.marginTop = '10px';

//                 // Append elements to the orderDiv
//                 orderDiv.appendChild(orderHeader);
//                 orderDiv.appendChild(orderDate);
//                 timeText==-1?timeRemaining.style.display="none":orderDiv.appendChild(timeRemaining);
//                 orderDiv.appendChild(orderStatus)
//                 orderDiv.appendChild(orderStatus);
//                 orderDiv.appendChild(itemsList);
//                 orderDiv.appendChild(orderTotal);

//                 // Add rating and review if delivered
//                 if (order.delivered) {
//                     const rating = createStarRating(order.id, order.rating);
//                     const reviewBox = createReviewBox(order.id, order.review);
//                     orderDiv.appendChild(rating);
//                     orderDiv.appendChild(reviewBox);
//                 }

//                 // Append orderDiv to ordersContainer
//                 ordersContainer.appendChild(orderDiv);
//             });
//         } catch (error) {
//             console.error('Error fetching orders:', error);
//             alert('Could not fetch your orders. Please try again later.');
//         }
//     };

//     const init = async () => {
//         const userSession = sessionStorage.getItem('user');
//         if (!userSession) {
//             alert('You need to log in to view your orders.');
//             window.location.href = 'login.html?authType=customer';
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
    const deliveryDuration = 30 * 60 * 1000; // 1 hour in milliseconds

    const calculateRemainingTime = (orderTime) => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - new Date(orderTime).getTime();
        const remainingTime = deliveryDuration - elapsedTime;
        return remainingTime > 0 ? remainingTime : 0;
    };

    const updateDeliveryStatus = async (orderId) => {
        try {
            const response = await fetch(`https://casserolecoserver.glitch.me/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delivered: true }),
            });
            if (!response.ok) {
                throw new Error('Failed to update delivery status');
            }
        } catch (error) {
            console.error('Error updating delivery status:', error);
        }
    };

    const createStarRating = (orderId, existingRating) => {
        const ratingContainer = document.createElement('div');
        ratingContainer.style.display = 'flex';
        ratingContainer.style.alignItems = 'center';
        ratingContainer.style.justifyContent = 'center';
        ratingContainer.style.marginTop = '15px';

        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.style.cursor = existingRating ? 'default' : 'pointer';
            star.style.fontSize = '24px';
            star.style.color = i <= (existingRating || 0) ? '#FFC107' : 'rgba(255, 215, 0, 0.5)';
            star.style.marginRight = '8px';
            star.style.transition = 'color 0.3s ease';

            if (!existingRating) {
                star.addEventListener('click', () => {
                    stars.forEach((s, index) => {
                        s.style.color = index < i ? '#FFC107' : '#D1B280';
                    });
                    ratingContainer.dataset.rating = i; // Store rating for submission
                });
            }

            stars.push(star);
            ratingContainer.appendChild(star);
        }
        return ratingContainer;
    };

    const createReviewBox = (orderId, existingReview) => {
        const reviewContainer = document.createElement('div');
        reviewContainer.style.marginTop = '15px';

        if (existingReview) {
            const reviewText = document.createElement('p');
            reviewText.textContent = `Review: ${existingReview}`;
            reviewText.style.marginTop = '5px';
            reviewText.style.padding = '10px';
            reviewText.style.background = 'rgba(245, 229, 209, 0.8)';
            reviewText.style.borderRadius = '8px';
            reviewText.style.border = '1px solid rgba(225, 202, 171, 0.8)';
            reviewText.style.color = '#6C4F3D';
            reviewText.style.fontFamily = '"Poppins", sans-serif';
            reviewText.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            reviewContainer.appendChild(reviewText);
        } else {
            const textArea = document.createElement('textarea');
            textArea.placeholder = 'Share your experience...';
            textArea.style.width = '100%';
            textArea.style.height = '100px';
            textArea.style.borderRadius = '12px';
            textArea.style.border = 'none';
            textArea.style.padding = '15px';
            textArea.style.background = 'rgba(255, 255, 255, 0.6)'; // Glass-like transparency
            textArea.style.backdropFilter = 'blur(8px)';
            textArea.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            textArea.style.fontFamily = 'Arial, sans-serif';
            textArea.style.fontSize = '14px';
            textArea.style.marginBottom = '12px';
            textArea.style.color = '#3e2723'; // Dark brown
            textArea.style.outline = 'none';

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit Review';
            submitButton.style.padding = '12px 20px';
            submitButton.style.borderRadius = '8px';
            submitButton.style.border = 'none';
            submitButton.style.background = 'rgba(212, 175, 55, 0.85)'; // Golden honey
            submitButton.style.color = '#fff';
            submitButton.style.cursor = 'pointer';
            submitButton.style.fontWeight = 'bold';
            submitButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            submitButton.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';

            submitButton.addEventListener('mouseover', () => {
                submitButton.style.background = 'rgba(184, 134, 11, 0.9)'; // Deeper golden
                submitButton.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
            });
            submitButton.addEventListener('mouseout', () => {
                submitButton.style.background = 'rgba(212, 175, 55, 0.85)';
                submitButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            });

            submitButton.addEventListener('click', async () => {
                const reviewText = textArea.value.trim();
                const rating = reviewContainer.previousElementSibling.dataset.rating;

                if (!rating || !reviewText) {
                    alert('Please provide a rating and review before submitting.');
                    return;
                }

                try {
                    const response = await fetch(`https://casserolecoserver.glitch.me/orders/${orderId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ rating: parseInt(rating, 10), review: reviewText }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to submit review');
                    }

                    alert('Thank you for your review!');
                    location.reload(); // Refresh to display the saved review
                } catch (error) {
                    console.error('Error submitting review:', error);
                    alert('Failed to submit your review. Please try again later.');
                }
            });

            reviewContainer.appendChild(textArea);
            reviewContainer.appendChild(submitButton);
        }
        return reviewContainer;
    };

    const displayOrders = (userOrders) => {
        const ordersContainer = document.getElementsByClassName('orders-container')[0];
        ordersContainer.innerHTML = '';

        if (userOrders.length === 0) {
            ordersContainer.textContent = 'No orders found.';
            return;
        }

        ordersContainer.style.width= "800px";

        // Create main card and slider
        const mainCardContainer = document.createElement('div');
        const sliderContainer = document.createElement('div');

        mainCardContainer.style.marginBottom = '20px';
        sliderContainer.style.display = 'flex';
        sliderContainer.style.overflowX = 'scroll';
        sliderContainer.style.gap = '15px';
        sliderContainer.style.width= "100%";

        const createOrderCard = (order, isMain = false) => {
            const orderDiv = document.createElement('div');
            orderDiv.style.borderRadius = '15px';
            orderDiv.style.margin = isMain ? '0 auto 20px auto' : '0';
            orderDiv.style.padding = '20px';
            orderDiv.style.background = 'rgba(255, 255, 255, 0.5)'; // Glass-like effect
            orderDiv.style.backdropFilter = 'blur(10px)';
            orderDiv.style.boxShadow = '0 8px 16px rgba(188, 166, 2, 0.93)';
            orderDiv.style.fontFamily = 'Arial, sans-serif';
            orderDiv.style.color = 'black'; // Dark brown
            orderDiv.style.transition = 'transform 0.2s ease';
            orderDiv.style.width = isMain ? '70%' : '450px';
            orderDiv.style.height = !isMain ? '260px' : '50%';
            orderDiv.style.cursor = isMain ? 'default' : 'pointer';

            orderDiv.addEventListener('mouseover', () => {
                if (!isMain) orderDiv.style.transform = 'scale(1.05)';
            });
            orderDiv.addEventListener('mouseout', () => {
                if (!isMain) orderDiv.style.transform = 'scale(1)';
            });

            const orderHeader = document.createElement('h3');
            orderHeader.textContent = `Order ID: ${order.id}`;
            orderHeader.style.marginBottom = '12px';

            const orderDate = document.createElement('p');
            orderDate.textContent = `${new Date(order.time).toLocaleString()}`;
            orderDate.style.marginBottom = '12px';

            const remainingTime = calculateRemainingTime(order.time);
            const timeText = remainingTime > 0
                ? `Time Remaining: ${Math.ceil(remainingTime / 60000)} mins`
                : -1;

            const timeRemaining = document.createElement('p');
            timeRemaining.textContent = timeText;
            timeRemaining.style.color = remainingTime > 0 ? 'darkbrown' : 'red';
            timeRemaining.style.marginBottom = '12px';

            const orderStatus = document.createElement('p');
            orderStatus.textContent = `Status: ${order.delivered ? 'Delivered' : "On it's way"}`;
            orderStatus.style.color = order.delivered ? 'green' : 'red'; // Delivered green, pending burnt orange
            orderStatus.style.marginBottom = '12px';

            if (!order.delivered && remainingTime <= 0) {
                orderStatus.textContent = 'Status: Delivered';
                orderStatus.style.color = '#3c763d';
                updateDeliveryStatus(order.id);
            }

            const orderTotal = document.createElement('h4');
            orderTotal.textContent = `Total: ₹${order.total}`;

            orderDiv.appendChild(orderHeader);
            orderDiv.appendChild(orderDate);
            if(isMain)
            {timeText==-1?timeRemaining.style.display="none":orderDiv.appendChild(timeRemaining);
            orderDiv.appendChild(orderStatus);}

            if (order.delivered && isMain) {
                const rating = createStarRating(order.id, order.rating);
                const reviewBox = createReviewBox(order.id, order.review);
                orderDiv.appendChild(rating);
                orderDiv.appendChild(reviewBox);
            }
            orderDiv.appendChild(orderTotal);
            orderDiv.addEventListener('click', () => {
                if (!isMain) {
                    mainCardContainer.innerHTML = '';
                    const mainCard = createOrderCard(order, true);
                    mainCardContainer.appendChild(mainCard);
                }
            });

            return orderDiv;
        };

        const mainCard = createOrderCard(userOrders[0], true);
        mainCardContainer.appendChild(mainCard);

        userOrders.forEach((order) => {
            const card = createOrderCard(order);
            sliderContainer.appendChild(card);
        });

        ordersContainer.appendChild(mainCardContainer);
        ordersContainer.appendChild(sliderContainer);
    };

    const fetchOrders = async () => {
        const useremail = sessionStorage.getItem('user');
        if (!useremail) {
            alert('You need to log in to view your orders.');
            window.location.href = 'login.html?authType=customer';
            return;
        }

        try {
            const response = await fetch('https://casserolecoserver.glitch.me/orders');
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const orders = await response.json();
            const userOrders = orders.filter((order) => order.email === useremail);
            userOrders.sort((a, b) => new Date(b.time) - new Date(a.time));
            displayOrders(userOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Could not fetch your orders. Please try again later.');
        }
    };

    const init = async () => {
        const userSession = sessionStorage.getItem('user');
        if (!userSession) {
            alert('You need to log in to view your orders.');
            window.location.href = 'login.html?authType=customer';
            return;
        }
        await fetchOrders();
    };

    return {
        init,
    };
})();

ordersPage.init();

