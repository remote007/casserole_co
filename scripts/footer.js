export function loadFooter() {
    fetch('../../includes/footer.html')
        .then(response => response.text())
        .then(footerHTML => {
            document.getElementById('footer-div').innerHTML=`<footer class="footer">
    <div class="footer-content">
        <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Careers</a></li>
        </ul>
        <p>&copy; 2025 Caserolle Co. All rights reserved.</p>
    </div>
</footer>`;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}
