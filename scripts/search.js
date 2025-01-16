export function createSearchInput(onSearch) {
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search-container');

    const searchInput = document.createElement('input');
    searchInput.classList.add('search-input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search by name...';

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        onSearch(query);
    });

    const icon = document.createElement('span');
    icon.innerHTML = '&#128269;'; // Unicode for a magnifying glass (search icon)
    icon.classList.add('search-icon');
    
    searchContainer.appendChild(searchInput);
    searchContainer.style['width'] = '280px';
    searchContainer.style['margin-left'] = '0px';
    searchContainer.style['padding-left'] = '0px';
    searchContainer.style['margin'] = 'auto';
    searchContainer.style['text-align'] =  'left';
    searchContainer.style['justify-content'] =  'left';
    searchContainer.appendChild(icon);
    return searchContainer;
}
