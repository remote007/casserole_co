const cart = (() => {
    const CART_URL = 'https://casserolecoserver.glitch.me/cart';
    const MENU_URL = 'https://casserolecoserver.glitch.me/menu';

    // Fetch the cart from the server for the logged-in user
    const fetchCartFromServer = async () => {
        try {
            const response = await fetch(CART_URL, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Failed to fetch cart data from server.');
            }
            const carts = await response.json();

            const userSession = sessionStorage.getItem('user');
            if (!userSession) {
                alert('No user is logged in.');
                return [];
            }

            const user = JSON.parse(userSession);
            const userEmail = user.username;

            // Find the cart for the logged-in user
            const userCart = carts.find(cart => cart.username === userEmail);
            return userCart ? userCart : null; // Return the entire cart object
        } catch (error) {
            console.error('Error fetching cart:', error);
            return null;
        }
    };

    // Save the cart to the server for the logged-in user
    const saveCartToServer = async (cartId, cartItems) => {
        try {
            const userSession = sessionStorage.getItem('user');
            if (!userSession) {
                alert('No user is logged in.');
                return;
            }

            const user = JSON.parse(userSession);
            const userEmail = user.username;

            const requestData = {
                id: cartId,
                username: userEmail,
                order: cartItems
            };

            const response = await fetch(`${CART_URL}/${cartId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Failed to save cart to server.');
            }
            console.log('Cart saved successfully');
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    };

    // Fetch the menu items from the server
    const fetchMenuItems = async () => {
        try {
            const response = await fetch(MENU_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch menu items.');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching menu:', error);
            return [];
        }
    };

    // Add an item to the cart
    const addItem = async (itemId) => {
        const menuItems = await fetchMenuItems();
        const item = menuItems.find(menuItem => menuItem.id === itemId);

        if (!item) {
            console.error(`Item with ID ${itemId} not found in menu.`);
            return;
        }

        const userCart = await fetchCartFromServer();
        if (!userCart) return;

        const cartItems = userCart.order;
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ id: item.id, quantity: 1 });
        }

        await saveCartToServer(userCart.id, cartItems);
    };

    // Update the quantity of an item in the cart
    const updateItem = async (itemId, quantity) => {
        const userCart = await fetchCartFromServer();
        if (!userCart) return;

        const cartItems = userCart.order;
        const itemIndex = cartItems.findIndex(cartItem => cartItem.id === itemId);

        if (itemIndex !== -1) {
            if (quantity > 0) {
                cartItems[itemIndex].quantity = quantity;
            } else {
                cartItems.splice(itemIndex, 1); // Remove item if quantity is 0
            }
            await saveCartToServer(userCart.id, cartItems);
        } else {
            console.error(`Item with ID ${itemId} not found in cart.`);
        }
    };

    // Remove an item from the cart
    const removeItem = async (itemId) => {
        const userCart = await fetchCartFromServer();
        if (!userCart) return;

        const cartItems = userCart.order;
        const updatedCart = cartItems.filter(item => item.id !== itemId);

        await saveCartToServer(userCart.id, updatedCart);
    };

    // Clear the entire cart for the logged-in user
    const clear = async () => {
        const userCart = await fetchCartFromServer();
        if (!userCart) return;

        await saveCartToServer(userCart.id, []);
    };

    // Get all items in the cart for the logged-in user
    const getItems = async () => {
        const userCart = await fetchCartFromServer();
        if (!userCart) return [];

        const cartItems = userCart.order;
        const menuItems = await fetchMenuItems();

        return cartItems.map(cartItem => {
            const menuItem = menuItems.find(item => item.id === cartItem.id);
            return {
                ...cartItem,
                name: menuItem ? menuItem.name : 'Unknown Item',
                price: menuItem ? menuItem.price : 0,
            };
        });
    };

    // Get the total price of all items in the cart for the logged-in user
    const getTotal = async () => {
        const userCart = await fetchCartFromServer();
        if (!userCart) return 0;

        const cartItems = userCart.order;
        const menuItems = await fetchMenuItems();

        return cartItems.reduce((total, cartItem) => {
            const menuItem = menuItems.find(item => item.id === cartItem.id);
            if (menuItem) {
                return total + menuItem.price * cartItem.quantity;
            }
            return total;
        }, 0);
    };

    return {
        addItem,
        updateItem,
        removeItem,
        clear,
        getItems,
        getTotal
    };
})();

export default cart;
