const cart = (() => {
    const CART_KEY = 'cart';

    const saveCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));
    const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY)) || [];

    return {
        addItem(item) {
            const cartItems = loadCart();
            const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({ ...item, quantity: 1 });
            }
            saveCart(cartItems);
        },

        updateItem(itemId, quantity) {
            const cartItems = loadCart();
            const itemIndex = cartItems.findIndex(cartItem => cartItem.id === itemId);
            if (itemIndex !== -1) {
                if (quantity > 0) {
                    cartItems[itemIndex].quantity = quantity;
                } else {
                    cartItems.splice(itemIndex, 1); // Remove item if quantity is 0
                }
            }
            saveCart(cartItems);
        },

        removeItem(itemId) {
            const cartItems = loadCart().filter(item => item.id !== itemId);
            saveCart(cartItems);
        },

        clear() {
            saveCart([]);
        },

        getItems() {
            return loadCart();
        },

        getTotal() {
            return loadCart().reduce((total, item) => total + item.price * item.quantity, 0);
        },
    };
})();

export default cart;
