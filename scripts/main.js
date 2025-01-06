import { loadNavbar } from './navbar.js';
import { loadMenu } from './menu.js';
import { loadAbout } from './about.js';
// import { loadContact } from './contact.js';
import { loadFooter } from './footer.js';

window.onload = () => {
    loadNavbar();
    let path = window.location.pathname;
    let fileName = path.substring(path.lastIndexOf('/') + 1);
    if(localStorage.getItem('about') == null && localStorage.getItem('contact') == null)
       loadMenu();
    else if(localStorage.getItem('about') !== null)
        loadAbout();
    else if(fileName=="contact.html")
        loadMenu();
    loadFooter(); 
};
