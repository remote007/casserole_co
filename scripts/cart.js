const cart = (() => {
    // function func(){
    //     if(localStorage.getItem('isLoggedIn') == null || localStorage.getItem('isLoggedIn') != 'true')
    //         {
    //             // window.location.href("login.html");
    //             alert("Please login to view cart");
    //         }
    // }
    // // window.addEventListener("load", func);    
    // document.onload = func();

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
            const item = cartItems.find(cartItem => cartItem.id === itemId);
            if (item) item.quantity = quantity;
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
