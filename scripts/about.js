export function loadAbout() {
  fetch('includes/about.html')
      .then(response => response.text())
      .then(aboutHTML => {
        document.getElementById('content').innerHTML=aboutHTML;
      })
      .catch(error => {
          console.error('Error loading navbar:', error);
      });
}
