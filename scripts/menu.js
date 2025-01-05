import { auth } from './auth.js';
import cart from './cart.js';

export async function loadMenu() {
    try {
        const response = await fetch('https://casserolecoserver.glitch.me/menu');
        const menu = await response.json();

        const grid = document.createElement('div');
        grid.classList.add('menu-grid');
        menu.forEach(item => {
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
            title.textContent = item.name;

            // Create and append description
            const description = document.createElement('p');
            description.textContent = item.description;

            const price = document.createElement('p');
            price.textContent = "Price: ₹ "+item.price;
            price.style["font-family"] = "Arial";
            
             
            const menu_desc = document.createElement('div');
            menu_desc.classList.add('menu_description');

            menu_desc.appendChild(title,description,price);

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
        const contentContainer = document.querySelector('.content');
        contentContainer.innerHTML = ''; // Clear any existing content
        contentContainer.appendChild(grid);
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

// Handle adding item to order
function addToCart(item) {
    if (auth.isLoggedIn) {
        const data = {
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
        };
        cart.addItem(data);
        alert(`${item.name} has been added to your order!`);
    } else {
        window.location.href = "login.html";
    }
}
