import cart from './cart.js';

const orderPayment = (() => {
    // Function to handle payment method selection and actions
    const checkSessionCart = async() => {
        const useremail = sessionStorage.getItem('user');
        if (!useremail) {
            alert('You need to be logged in to place an order.');
            window.location.href = 'login.html';
            return;
        }

        const cartItems = await cart.getItems();

        if (cartItems.length === 0) {
            alert('Your cart is empty. Add items to place an order.');
            window.location.href = 'menu.html';
            return;
        }
    };

    const makePayment = () => {
        checkSessionCart();
        // Retrieve payment method options
        const upiOption = document.getElementById('upi-option');
        const cardOption = document.getElementById('card-option');
        const codOption = document.getElementById('cod-option');

        // Retrieve forms for payment
        const upiForm = document.getElementById('upi-form');
        const cardForm = document.getElementById('card-form');
        const codForm = document.getElementById('cod-form');

        // Hide all forms initially
        upiForm.style.display = 'none';
        cardForm.style.display = 'none';
        codForm.style.display = 'none';

        // Add event listeners to payment method options
        upiOption?.addEventListener('click', () => {
            upiForm.style.display = 'block';
            cardForm.style.display = 'none';
            codForm.style.display = 'none';
        });

        cardOption?.addEventListener('click', () => {
            upiForm.style.display = 'none';
            cardForm.style.display = 'block';
            codForm.style.display = 'none';
        });

        codOption?.addEventListener('click', () => {
            upiForm.style.display = 'none';
            cardForm.style.display = 'none';
            codForm.style.display = 'block';
        });

        // Handle UPI Payment Submission
        document.getElementById('upi-submit')?.addEventListener('click', () => {
            const upiId = document.getElementById('upi-id').value;
            if (upiId) {
                alert(`UPI Payment Successful for ID: ${upiId}`);
                sessionStorage.setItem('paymentStatus', 'success');
                placeOrder(); // Proceed to place the order
            } else {
                alert('Please enter a valid UPI ID.');
            }
        });

        // Handle Card Payment Submission
        document.getElementById('card-submit')?.addEventListener('click', () => {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;

            if (cardNumber && expiryDate && cvv) {
                alert(`Card Payment Successful for card ending with ${cardNumber.slice(-4)}`);
                sessionStorage.setItem('paymentStatus', 'success');
                placeOrder(); // Proceed to place the order
            } else {
                alert('Please fill in all card details.');
            }
        });

        // Handle COD Confirmation
        document.getElementById('cod-submit')?.addEventListener('click', () => {
            alert('Cash on Delivery Order Confirmed.');
            sessionStorage.setItem('paymentStatus', 'success');
            placeOrder(); // Proceed to place the order
        });
    };

    // Function to place the order after payment success
    const placeOrder = async () => {
        const cartItems = await cart.getItems();
        checkSessionCart();
        const useremail = sessionStorage.getItem('user');

        const paymentStatus = sessionStorage.getItem('paymentStatus');
        if (paymentStatus !== 'success') {
            alert('Payment was not successful. Please try again.');
            window.location.href = 'payment.html';
            return;
        }

        const totalAmount = await cart.getTotal();

        // Fetch existing orders to determine the next orderId
        let orderId;
        try {
            const ordersResponse = await fetch('https://casserolecoserver.glitch.me/orders');
            if (!ordersResponse.ok) throw new Error('Failed to fetch orders');

            const orders = await ordersResponse.json();
            orderId = orders.length + 1; // Set the orderId
        } catch (error) {
            console.error('Error fetching existing orders:', error);
            alert('Could not fetch the current orders. Please try again later.');
            return;
        }

        // Prepare order data
        const order = {
            id:orderId,
            email: useremail,
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
            time: new Date().toISOString(),
            delivered: false,
            total: totalAmount
        };

        // Send order to the server
        try {
            const response = await fetch('https://casserolecoserver.glitch.me/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });

            if (!response.ok) throw new Error('Failed to place the order.');

            alert('Order placed successfully!');
            await cart.clear(); // Clear the cart after successful order
            window.location.href = 'order.html'; // Redirect to homepage
        } catch (error) {
            console.error('Error placing the order:', error);
            alert('Could not place your order. Please try again later.');
        }
    };

    // Initialization function
    const init = async () => {
        console.log('Initializing payment functionalities...');
        makePayment();
    };

    return {
        init,
        placeOrder,
    };
})();

// Initialize the payment module when the script is loaded
orderPayment.init();

export default orderPayment;

