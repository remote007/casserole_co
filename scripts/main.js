import { loadNavbar } from './navbar.js';
import { loadMenu } from './menu.js';
import { loadFooter } from './footer.js';

window.onload = () => {
    loadNavbar();    // Dynamically load the navbar
    let path = window.location.pathname;
    // let fileName = path.substring(path.lastIndexOf('/') + 1);
    // if(fileName!="login.html")
       loadMenu();     // Fetch and load menu
    loadFooter();    // Dynamically load the footer
};
