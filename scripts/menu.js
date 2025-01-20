import { renderPagination } from './pagination.js';
import { createSearchInput } from './search.js';
import { createSortDropdown } from './sort.js';
import { auth } from './auth.js';
import cart from './cart.js';

export async function loadMenu() {
    const userEmail = sessionStorage.getItem('user');
    try {
        const response = await fetch('https://casserolecoserver.glitch.me/menu');
        const wishlistResponse = userEmail
            ? await fetch(`https://casserolecoserver.glitch.me/wishlist?email=${userEmail}`)
            : { json: () => [] };
        const wishlist = await wishlistResponse.json();
        const wishlistIds = wishlist.map(item => item.item_id);

        let menu = await response.json(); // Full menu data
        const contentContainer = document.querySelector('.content');
        contentContainer.innerHTML = ''; // Clear any existing content

        const firstContainer = document.createElement('div');
        const itemsPerPage = 10;
        let currentPage = 1;
        let filteredMenu = [...menu]; // Copy of the full menu for filtering and sorting

        // Sort Dropdown
        const sortContainer = createSortDropdown(sortValue => {
            if (sortValue === 'asc') {
                filteredMenu.sort((a, b) => a.price - b.price);
            } else if (sortValue === 'desc') {
                filteredMenu.sort((a, b) => b.price - a.price);
            }
            currentPage = 1; // Reset to the first page after sorting
            renderMenu(filteredMenu, currentPage);
        });

        // Search Input
        const searchContainer = createSearchInput(query => {
            filteredMenu = menu.filter(item =>
                item.name.toLowerCase().includes(query) // Search in the full menu
            );
            currentPage = 1; // Reset to the first page after filtering
            renderMenu(filteredMenu, currentPage);
        });

        firstContainer.style.display = 'grid';
        firstContainer.style.gridTemplateColumns = 'repeat(3,1fr)';
        firstContainer.style.margin = 'auto';

        const paginationContainer = document.createElement('div');
        contentContainer.appendChild(firstContainer);

        const grid = document.createElement('div');
        grid.classList.add('menu-grid');
        contentContainer.appendChild(grid);

        function renderMenu(menuItems, page = 1) {
            grid.innerHTML = ''; // Clear existing menu items
            paginationContainer.innerHTML = ''; // Clear pagination

            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = page * itemsPerPage;
            const itemsToShow = menuItems.slice(startIndex, endIndex);

            itemsToShow.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('menu-card');

                const image = document.createElement('img');
                image.src = `img/${item.imageUrl}`;
                image.alt = item.name;
                image.classList.add('menu-image');

                const title = document.createElement('h3');
                title.textContent = item.name;

                const description = document.createElement('p');
                description.textContent = item.description;

                const price = document.createElement('p');
                price.textContent = `Price: ₹${item.price}`;

                const wishlistIcon = document.createElement('i');
                wishlistIcon.classList.add('fas', 'fa-heart', 'wishlist-heart');
                if (wishlistIds.includes(item.id)) {
                    wishlistIcon.classList.add('active');
                }
                wishlistIcon.onclick = () => toggleWishlist(item.id, wishlistIcon);

                const button = document.createElement('button');
                button.textContent = 'Add to Cart';
                button.classList.add('add-to-cart-btn');
                button.onclick = () => addToCart(item);

                card.append(image, title, description, price, wishlistIcon, button);
                grid.appendChild(card);
            });

            const pagination = renderPagination(
                menuItems,
                page,
                itemsPerPage,
                newPage => {
                    currentPage = newPage;
                    renderMenu(menuItems, newPage);
                }
            );
            paginationContainer.appendChild(pagination);
        }

        firstContainer.appendChild(sortContainer);
        firstContainer.appendChild(searchContainer);
        firstContainer.appendChild(paginationContainer);

        renderMenu(filteredMenu);
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

async function toggleWishlist(itemId, heartIcon) {
    const userEmail = sessionStorage.getItem('user');
    if (!userEmail) {
        alert('Please log in to manage your wishlist.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('https://casserolecoserver.glitch.me/wishlist');
        const wishlist = await response.json();
        const wishlistItem = wishlist.find(item => item.item_id === itemId && item.email === userEmail);

        if (wishlistItem) {
            // Remove from wishlist
            await fetch(`https://casserolecoserver.glitch.me/wishlist/${wishlistItem.id}`, { method: 'DELETE' });
            heartIcon.classList.remove('active');
        } else {
            // Add to wishlist
            await fetch('https://casserolecoserver.glitch.me/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_id: itemId, email: userEmail }),
            });
            heartIcon.classList.add('active');
        }
    } catch (error) {
        console.error('Error managing wishlist:', error);
    }
}

async function addToCart(item) {
    const userEmail = sessionStorage.getItem('user');
    if (userEmail != null) {
        const data = {
            'id': item.id,
            'name': item.name,
            'price': parseFloat(item.price),
            'quantity': 1,
        };

        cart.addItem(data);

        try {
            const cartResponse = await fetch(`https://casserolecoserver.glitch.me/cart?email=${userEmail}`);
            const existingCart = await cartResponse.json();
            console.log(existingCart);
            if (existingCart && existingCart.length > 0) {
                const cartId = existingCart[0].id;
                const updateResponse = await fetch(`https://casserolecoserver.glitch.me/cart/${cartId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: cartId,
                        email: userEmail,
                        order: [...existingCart[0].order, { id: item.id, quantity: 1 }],
                    }),
                });

                if (updateResponse.ok) {
                    alert(`${item.name} has been added to your order!`);
                } else {
                    alert('Failed to update the cart. Please try again.');
                }
            } else {
                const createResponse = await fetch('https://casserolecoserver.glitch.me/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        order: [{ id: item.id, quantity: 1 }],
                    }),
                });

                if (createResponse.ok) {
                    alert(`${item.name} has been added to your order!`);
                } else {
                    alert('Failed to create cart. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error checking or updating cart:', error);
            alert('An error occurred while adding the item to the cart.');
        }
    } else {
        window.location.href = 'login.html';
    }
}