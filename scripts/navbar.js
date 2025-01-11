import { auth } from './auth.js';
export function loadNavbar() {
  fetch('includes/navbar.html')
      .then(response => response.text())
      .then(navbarHTML => {
        document.getElementById('navbar-container').innerHTML=navbarHTML;
        if(sessionStorage.getItem('user')!=null)
        { 
            const navAuthBtn = document.getElementById('login_btn_id');
            navAuthBtn.innerHTML = '<i class="fas fa-user"></i> Logout';
            navAuthBtn.href = '#';
            navAuthBtn.onclick = (e) => {
                e.preventDefault();
                auth.logout();
                alert('You have been logged out.');
                window.location.href = 'index.html';
            };
        }
      })
      .catch(error => {
          console.error('Error loading navbar:', error);
      });
}
