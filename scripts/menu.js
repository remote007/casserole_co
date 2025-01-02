export function loadMenu() {
    const menuUrl = 'https://casserolecoserver.glitch.me/menu';  // Fetching menu data from the Glitch server

    // Fetch the menu items from the Glitch server
    fetch(menuUrl)
        .then(response => response.json())
        .then(menuItems => {
            let menuHTML = '';
            menuItems.forEach(item => {
                // Reference images locally from the img folder
                const imageUrl = `img/${item.imageUrl}`; // Assuming the image names are stored in the 'imageUrl' property of the API response

                menuHTML += `
                    <div class="menu-card">
                        <img src="${imageUrl}" alt="${item.name}" class="menu-image">
                        <div class="menu-details">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            <p><strong>Price: ₹ ${item.price}</strong></p>
                        </div>
                    </div>
                `;
            });

            // Dynamically insert menu items into the page
            document.getElementById('app').insertAdjacentHTML('beforeend', `<div class="menu-grid">${menuHTML}</div>`);
        })
        .catch(error => {
            console.error('Error loading menu:', error);
            document.getElementById('app').insertAdjacentHTML('beforeend', '<p>Failed to load menu items.</p>');
        });
}
