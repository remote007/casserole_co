export function loadNavbar() {
  fetch('../includes/navbar.html')
      .then(response => response.text())
      .then(navbarHTML => {
          document.getElementById('navbar-container').innerHTML=navbarHTML;
      })
      .catch(error => {
          console.error('Error loading navbar:', error);
      });
}
