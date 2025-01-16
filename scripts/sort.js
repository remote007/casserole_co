export function createSortDropdown(onSort) {
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

    sortDropdown.addEventListener('change', () => onSort(sortDropdown.value));
    sortContainer.appendChild(sortDropdown);

    sortContainer.style['width'] = '100%';
    sortContainer.style['margin'] = 'auto';
    sortContainer.style['text-align'] =  'left';
    sortContainer.style['justify-content'] =  'left';
    sortContainer.style['margin-left'] = '0px';
    sortContainer.style['padding-left'] = '0px';

    return sortContainer;
}
