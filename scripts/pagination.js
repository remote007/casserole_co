export function renderPagination(menuItems, currentPage, itemsPerPage, onPageChange) {
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination-container');

    const totalPages = Math.ceil(menuItems.length / itemsPerPage);

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => onPageChange(currentPage - 1);
    paginationContainer.appendChild(prevButton);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) pageButton.classList.add('active');
        pageButton.onclick = () => onPageChange(i);
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => onPageChange(currentPage + 1);
    paginationContainer.appendChild(nextButton);

    paginationContainer.style['margin-right'] = '0px';
    paginationContainer.style['padding-right'] = '0px';
    paginationContainer.style['width'] = '100%';
    paginationContainer.style['text-align'] =  'right';
    paginationContainer.style['justify-content'] =  'right';

    return paginationContainer;
}
