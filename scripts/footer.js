export function loadFooter() {
    fetch('./includes/footer.html')
        .then(response => response.text())
        .then(footerHTML => {
            document.getElementById('footer-div').innerHTML=footerHTML;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}
