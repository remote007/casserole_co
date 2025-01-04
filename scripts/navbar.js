import { auth } from './auth.js';
export function loadNavbar() {
  fetch('includes/navbar.html')
      .then(response => response.text())
      .then(navbarHTML => {
        document.getElementById('navbar-container').innerHTML=navbarHTML;
        if(localStorage.getItem('isLoggedIn') === 'true')
        { 
            const navAuthBtn = document.getElementById('login_btn_id');
            navAuthBtn.textContent = "Logout";
            navAuthBtn.href = '#';
            navAuthBtn.onclick = (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                auth.logout();
                alert('You have been logged out.');
                window.location.href = 'index.html'; // Redirect to homepage
            };
        }
      })
      .catch(error => {
          console.error('Error loading navbar:', error);
      });
}
