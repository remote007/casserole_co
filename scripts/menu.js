import { auth } from './auth.js';
import cart from './cart.js';

export async function loadMenu() {
    try {
        const response = await fetch('https://casserolecoserver.glitch.me/menu');
        let menu = await response.json();

        const contentContainer = document.querySelector('.content');
        contentContainer.innerHTML = ''; // Clear any existing content
        const firstContainer = document.createElement('div');
        const sortContainer = document.createElement('div');
        sortContainer.classList.add('sort-container');
        const sortDropdown = document.createElement('select');
        sortDropdown.classList.add('sort-dropdown');
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Sort by Price';
        defaultOption.disabled = true;
        defaultOption.selected = true;

        const ascOption = document.createElement('option');
        ascOption.value = 'asc';
        ascOption.textContent = 'Price: Low to High';

        const descOption = document.createElement('option');
        descOption.value = 'desc';
        descOption.textContent = 'Price: High to Low';

        sortDropdown.appendChild(defaultOption);
        sortDropdown.appendChild(ascOption);
        sortDropdown.appendChild(descOption);

        sortContainer.appendChild(sortDropdown);
        sortContainer.style['width'] = '120px';
        sortContainer.style['text-align'] =  'center';
        sortContainer.style['justify-content'] =  'center';
        sortContainer.style['margin-right'] = '0px';
        sortContainer.style['padding-right'] = '0px';
        sortContainer.style['margin'] = 'auto';
        firstContainer.appendChild(sortContainer)
        // contentContainer.appendChild(sortContainer);

        // Add search input
        const searchContainer = document.createElement('div');
        searchContainer.classList.add('search-container');
        const searchInput = document.createElement('input');
        searchInput.classList.add('search-input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search by name...';

        searchContainer.appendChild(searchInput);
        searchContainer.style['width'] = '320px';
        searchContainer.style['margin-left'] = '0px';
        searchContainer.style['padding-left'] = '0px';
        firstContainer.appendChild(searchContainer);
        firstContainer.style['display'] = 'grid';
        firstContainer.style['grid-template-columns'] = 'repeat(2,1fr)' ;
        firstContainer.style['margin'] = 'auto';
        sortContainer.style['justify-content'] =  'left';

        contentContainer.appendChild(firstContainer);

        const grid = document.createElement('div');
        grid.classList.add('menu-grid');
        contentContainer.appendChild(grid);

        function renderMenu(menuItems) {
            grid.innerHTML = ''; // Clear existing menu
            menuItems.forEach(item => {
                // Create card container
                const card = document.createElement('div');
                card.classList.add('menu-card');

                // Create and append image
                const image = document.createElement('img');
                image.src = `img/${item.imageUrl}`;
                image.alt = item.name;
                image.classList.add('menu-image');
                card.appendChild(image);

                // Create and append title
                const title = document.createElement('h3');
                title.style["text-shadow"] = "0 0 4px rgba(233, 187, 4, 0.8), 0 0 7px rgba(233, 187, 4, 0.8), 0 0 9px rgba(233, 187, 4, 0.8)";
                title.textContent = item.name;

                // Create and append description
                const description = document.createElement('p');
                description.textContent = item.description;
                description.style["font-size"] = "small";

                const price = document.createElement('p');
                price.textContent = "Price: ₹ " + item.price;
                price.style["font-family"] = "sans-serif";
                price.style["font-size"] = "medium";
                price.style["color"] = "black";

                const menu_desc = document.createElement('div');
                menu_desc.classList.add('menu_description');

                menu_desc.appendChild(title);
                menu_desc.appendChild(description);
                menu_desc.appendChild(price);

                card.appendChild(menu_desc);

                // Create and append "Add to Cart" button
                const button = document.createElement('button');
                button.textContent = 'Add to Cart';
                button.classList.add('add-to-cart-btn');
                button.onclick = () => addToCart(item);
                card.appendChild(button);

                // Append card to content container
                grid.appendChild(card);
            });
        }

        // Initial render
        renderMenu(menu);

        // Handle search input
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const filteredMenu = menu.filter(item =>
                item.name.toLowerCase().includes(query)
            );
            renderMenu(filteredMenu);
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

async function addToCart(item) {
    if (auth.isLoggedIn()) {
        const data = {
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            quantity: 1,  // Assuming quantity is 1 by default
        };

        // Add item to the local cart (client-side)
        cart.addItem(data);
        const user = JSON.parse(sessionStorage.getItem('user'));
        const userEmail = user.username;
        // Check if the user has a cart on the server
        try {
            const cartResponse = await fetch(`https://casserolecoserver.glitch.me/cart?username=${userEmail}`);
            const existingCart = await cartResponse.json();

            if (existingCart && existingCart.length > 0) {
                // Cart exists, update it
                const cartId = existingCart[0].id;

                const updateResponse = await fetch(`https://casserolecoserver.glitch.me/cart/${cartId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id : cartId,
                        username: userEmail,
                        order: [...existingCart[0].order, { id: item.id, quantity: 1 }] // Update with new item
                    }),
                });

                if (updateResponse.ok) {
                    alert(`${item.name} has been added to your order!`);
                } else {
                    alert('Failed to update the cart. Please try again.');
                }
            } else {
                // Cart does not exist, create a new one
                const createResponse = await fetch('https://casserolecoserver.glitch.me/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: userEmail,
                        order: [{ id: item.id, quantity: 1 }]
                    })
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
        window.location.href = "login.html";
    }
}