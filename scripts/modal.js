import { auth } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    if (modal) {
        if (await auth.isLoggedIn()) {
            alert("Already Logged In");
            window.location.href = "index.html";
            return;
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

        openModal();
        closeModal.addEventListener('click', closeAndRedirect);

        showSignup.addEventListener('click', () => {
            loginSection.style.display = 'none';
            signupSection.style.display = 'block';
        });

        showLogin.addEventListener('click', () => {
            signupSection.style.display = 'none';
            loginSection.style.display = 'block';
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const user = await auth.login(username, password);
                alert(`Welcome back, ${user.username}!`);
                closeAndRedirect();
            } catch (error) {
                alert(error.message);
            }
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;

            try {
                await auth.signup(username, password);
                alert(`Account created for ${username}!`);
                closeAndRedirect();
            } catch (error) {
                alert(error.message);
            }
        });
    }
});
