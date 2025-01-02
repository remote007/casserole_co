import { loadNavbar } from './navbar.js';
import { loadMenu } from './menu.js';
import { loadFooter } from './footer.js';

window.onload = () => {
    loadNavbar();    // Dynamically load the navbar
    loadMenu();     // Fetch and load menu
    loadFooter();    // Dynamically load the footer
};
