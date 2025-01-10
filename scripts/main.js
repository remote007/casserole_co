import { loadNavbar } from './navbar.js';
import { loadMenu } from './menu.js';
import { loadFooter } from './footer.js';

window.onload = () => {
    loadNavbar();
    // let path = window.location.pathname;
    // let fileName = path.substring(path.lastIndexOf('/') + 1);
    loadMenu();
    loadFooter(); 
};
