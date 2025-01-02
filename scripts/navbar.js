export function loadNavbar() {
  fetch('includes/navbar.html')
      .then(response => response.text())
      .then(navbarHTML => {
        //   document.getElementById('navbar-container').innerHTML=navbarHTML;
        document.getElementById('navbar-container').innerHTML=`<div class="logo">
        <a href="/">Casserole Co.</a>
    </div>
    <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="#">Menu</a></li>
        <li><a href="#">Order Online</a></li>
        <li><a href="#">Locations</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="#">Contact</a></li>
    </ul>`;
      })
      .catch(error => {
          console.error('Error loading navbar:', error);
      });
}
