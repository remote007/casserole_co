import cart from './cart.js';
// import addToCart from './menu.js'

const API_URL = 'https://casserolecoserver.glitch.me/wishlist';
const CART_API_URL = 'https://casserolecoserver.glitch.me/cart';

export async function loadWishlist() {
    const userEmail = sessionStorage.getItem('user');
    if (!userEmail) {
        alert('Please log in to view your wishlist.');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}?email=${userEmail}`);
        const wishlist = await response.json();
        if (wishlist.length === 0) {
            alert('Your wishlist is empty. Please add items to view them.');
            window.location.href = 'menu.html';  // Redirect to menu page
            return;
        }
        const container = document.getElementById('wishlist-container');
        container.innerHTML = '';

        for (const item of wishlist) {
            const itemResponse = await fetch(`https://casserolecoserver.glitch.me/menu/${item.item_id}`);
            const itemDetails = await itemResponse.json();

            const card = document.createElement('div');
            card.classList.add('wishlist-card');

            const image = document.createElement('img');
            image.src = `img/${itemDetails.imageUrl}`;
            image.alt = itemDetails.name;
            image.classList.add('wishlist-image');

            const title = document.createElement('h3');
            title.textContent = itemDetails.name;

            const price = document.createElement('p');
            price.textContent = `Price: ₹${itemDetails.price}`;

            const cartbtn = document.createElement('button');
            cartbtn.textContent = 'Move to Cart';
            cartbtn.classList.add("cart-btn");
            cartbtn.onclick = () => moveToCart(itemDetails.id);


            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-from-wishlist-btn');
            removeButton.onclick = () => removeFromWishlist(itemDetails.id);

            card.append(image, title, price, cartbtn,removeButton);
            container.appendChild(card);
            const main_container = document.getElementsByClassName('wishlist-content')[0];
            main_container.appendChild(container);
        }
    } catch (error) {
        console.error('Error loading wishlist:', error);
    }
}

async function removeFromWishlist(id) {
    const userEmail = sessionStorage.getItem('user');
    if (!userEmail) {
        alert('Please log in to remove items from your wishlist.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Sending the DELETE request to remove the item from the wishlist
        const response = await fetch(`${API_URL}?email=${userEmail}`);
        const wishlist = await response.json();
        const wishlistItem = wishlist.find(item => item.item_id === id);

        if (wishlistItem) {
            // Removing the item from the wishlist
            await fetch(`${API_URL}/${wishlistItem.id}`, {
                method: 'DELETE',
            });
            loadWishlist();
            console.log('Item removed from wishlist:', wishlistItem.id);
        } else {
            console.log('Item not found in wishlist');
        }
    } catch (error) {
        console.error('Error removing item from wishlist:', error);
        alert('Failed to remove item from wishlist. Please try again.');
    }
}

async function moveToCart(id) {
    const email = sessionStorage.getItem('user');
    if (!email) {
        alert('Please log in to add items to your cart.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // const response = await fetch(`${API_URL}/${id}`);
        // const item = await response.json();

        // Add item to cart
        const cartResponse = await fetch(`${CART_API_URL}?email=${email}`);
        const existingCart = await cartResponse.json();

        if (existingCart.length > 0) {
            const cartId = existingCart[0].id;
            const updatedOrder = [...existingCart[0].order, { id: id, quantity: 1 }];

            await fetch(`${CART_API_URL}/${cartId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...existingCart[0], order: updatedOrder }),
            });
        } else {
            await fetch(CART_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    order: [{ id: id, quantity: 1 }],
                }),
            });
        }

        // Remove from Wishlist after adding to cart
        await removeFromWishlist(id);
        alert(`Item moved to cart!`);
    } catch (error) {
        console.error('Error moving to cart:', error);
        alert('Failed to move item to cart. Please try again.');
    }
}

loadWishlist();
