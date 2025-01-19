import { auth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close-modal');
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Check if user is already logged in
    if (sessionStorage.getItem("user") != null) {
        alert("Already Logged In");
        window.location.href = "index.html";
        return;
    }

    // Get authType from URL or sessionStorage, and set it in sessionStorage
    const authType = new URLSearchParams(window.location.search).get('authType') || sessionStorage.getItem('authType');
    sessionStorage.setItem('authType', authType);

    // Elements for the extra fields (admin or customer)
    const adminExtraFields = document.getElementById('admin-extra-fields');
    const customerExtraFields = document.getElementById('customer-extra-fields');
    const adminExtraSignupFields = document.getElementById('admin-extra-signup-fields');
    const customerExtraSignupFields = document.getElementById('customer-extra-signup-fields');

    // Adjust modal fields based on authType
    if (authType === 'admin') {
        adminExtraFields.style.display = 'block';
        adminExtraSignupFields.style.display = 'block';
        const email = document.getElementById("login-email");
        email.removeAttribute('required');
        email.style.display = 'none';
        email.classList.remove('input_class');
        customerExtraFields.style.display = 'none';
        customerExtraSignupFields.style.display = 'none';
    } else if (authType === 'customer') {
        customerExtraFields.style.display = 'block';
        const empid = document.getElementById('login-empid');
        empid.removeAttribute('required');
        empid.style.display = 'none';
        empid.classList.remove('input_class');
        adminExtraFields.style.display = 'none';
        adminExtraSignupFields.style.display = 'none';
        adminExtraSignupFields.removeAttribute('required');
    }

    // Open the modal
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        window.location.href = 'index.html';
    });

    // Switch between Login and Signup sections
    showSignup.addEventListener('click', () => {
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    });

    showLogin.addEventListener('click', () => {
        signupSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const identifier = authType === 'admin'
            ? document.getElementById('login-empid').value
            : document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const user = await auth.login(identifier, password, authType);
            alert(`Welcome back, ${user.username}!`);
            closeAndRedirect();
        } catch (error) {
            alert(error.message);
        }
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username') ? document.getElementById('signup-username').value:'';
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const empId = document.getElementById('signup-empid') ? document.getElementById('signup-empid').value : ''; // Only for admin
        const address = document.getElementById('signup-address') ? document.getElementById('signup-address').value:'';
        const phone = document.getElementById('signup-phone') ? document.getElementById('signup-phone').value:'';
        
        const data =
            authType === 'admin'
                ? { username:username,empid: empId, password:password }
                : { username:username,email:email, password:password ,address:address,phone:phone};
        console.log(data);
        try {
            await auth.signup(data, authType);
            alert(`Account created for ${username}!`);
            closeAndRedirect();
        } catch (error) {
            alert(error.message);
        }
    });

    // Redirect after successful login/signup
    const closeAndRedirect = () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        window.location.href = 'index.html';
    };
});
