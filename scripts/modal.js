import { auth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const modal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    // Automatically open modal on page load for login.html
    if (modal) {
        if(auth.isLoggedIn)
        {
            alert("Already Logged In");
            window.location.href = "index.html";
        }
        const openModal = () => {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
        };

        const closeAndRedirect = () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            window.location.href = 'index.html';
        };

        // Open the modal on page load
        openModal();

        // Close modal
        closeModal.addEventListener('click', closeAndRedirect);

        // Switch to Signup
        showSignup.addEventListener('click', () => {
            loginSection.style.display = 'none';
            signupSection.style.display = 'block';
        });

        // Switch to Login
        showLogin.addEventListener('click', () => {
            signupSection.style.display = 'none';
            loginSection.style.display = 'block';
        });

        // Handle Login
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            if (username && password) {
                auth.login(username);
                alert(`Welcome back, ${username}!`);
                closeAndRedirect();
                updateNavbarAuthButton();
            } else {
                alert('Please enter valid credentials.');
            }
        });

        // Handle Signup
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;

            if (username && password) {
                auth.login(username);
                alert(`Account created for ${username}!`);
                closeAndRedirect();
                updateNavbarAuthButton();
            } else {
                alert('Please enter all required fields.');
            }
        });
    }
});


