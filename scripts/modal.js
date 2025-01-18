// import { auth } from './auth.js';

// document.addEventListener('DOMContentLoaded', async () => {
//     const modal = document.getElementById('auth-modal');
//     const closeModal = document.querySelector('.close-modal');
//     const loginForm = document.getElementById('login-form');
//     const signupForm = document.getElementById('signup-form');
//     const loginSection = document.getElementById('login-section');
//     const signupSection = document.getElementById('signup-section');
//     const showSignup = document.getElementById('show-signup');
//     const showLogin = document.getElementById('show-login');

//     // Additional fields for admin and customer
//     const loginEmpId = document.getElementById('login-empid');
//     const signupEmail = document.getElementById('signup-email');
//     const signupAddress = document.getElementById('signup-address');
//     const signupPhone = document.getElementById('signup-phone');
//     const signupEmpId = document.getElementById('signup-empid');

//     // Get authType from the URL
//     const authType = new URLSearchParams(window.location.search).get('authType');
//     sessionStorage.setItem('authType', authType);

//     if (modal) {
//         if (await auth.isLoggedIn()) {
//             alert("Already Logged In");
//             window.location.href = "index.html";
//             return;
//         }

//         // Configure fields and sections based on authType
//         const configureFields = () => {
//             if (authType === 'admin') {
//                 // Show admin-specific fields
//                 loginEmpId.style.display = 'block';
//                 signupEmpId.style.display = 'block';

//                 // Hide customer-specific fields
//                 signupEmail.style.display = 'none';
//                 signupAddress.style.display = 'none';
//                 signupPhone.style.display = 'none';
//             } else if (authType === 'customer') {
//                 // Hide admin-specific fields
//                 loginEmpId.style.display = 'none';
//                 signupEmpId.style.display = 'none';

//                 // Show customer-specific fields
//                 signupEmail.style.display = 'block';
//                 signupAddress.style.display = 'block';
//                 signupPhone.style.display = 'block';
//             }
//         };

//         const openModal = () => {
//             modal.style.display = 'flex';
//             document.body.classList.add('modal-open');
//             configureFields(); // Configure fields based on authType
//         };

//         const closeAndRedirect = () => {
//             modal.style.display = 'none';
//             document.body.classList.remove('modal-open');
//             window.location.href = 'index.html';
//         };

//         openModal();
//         closeModal.addEventListener('click', closeAndRedirect);

//         // Switch between login and signup
//         showSignup.addEventListener('click', () => {
//             loginSection.style.display = 'none';
//             signupSection.style.display = 'block';
//         });

//         showLogin.addEventListener('click', () => {
//             signupSection.style.display = 'none';
//             loginSection.style.display = 'block';
//         });

//         // Handle login form submission
//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const username = document.getElementById('login-username').value;
//             const password = document.getElementById('login-password').value;
//             const empId = loginEmpId.value; // Optional for admin

//             try {
//                 const user = await auth.login(username, password, authType, empId);
//                 alert(`Welcome back, ${user.username}!`);
//                 closeAndRedirect();
//             } catch (error) {
//                 alert(error.message);
//             }
//         });

//         // Handle signup form submission
//         signupForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const username = document.getElementById('signup-username').value;
//             const password = document.getElementById('signup-password').value;
//             const email = signupEmail.value;
//             const address = signupAddress.value;
//             const phone = signupPhone.value;
//             const empId = signupEmpId.value; // Optional for admin

//             const data =
//                 authType === 'admin'
//                     ? { username, password, empId }
//                     : { username, password, email, address, phone };

//             try {
//                 await auth.signup(data, authType);
//                 alert(`Account created for ${username}!`);
//                 closeAndRedirect();
//             } catch (error) {
//                 alert(error.message);
//             }
//         });
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close-modal');
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    // AuthType logic
    const authType = new URLSearchParams(window.location.search).get('authType') || sessionStorage.getItem('authType');
    sessionStorage.setItem('authType', authType);

    // Adjust modal fields based on authType
    const adminExtraFields = document.getElementById('admin-extra-fields');
    const customerExtraFields = document.getElementById('customer-extra-fields');
    const adminExtraSignupFields = document.getElementById('admin-extra-signup-fields');

    if (authType === 'admin') {
        adminExtraFields.style.display = 'block';
        adminExtraSignupFields.style.display = 'block';
        customerExtraFields.style.display = 'none';
    } else if (authType === 'customer') {
        customerExtraFields.style.display = 'block';
        adminExtraFields.style.display = 'none';
        adminExtraSignupFields.style.display = 'none';
    }

    // Open modal
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        window.location.href = 'index.html';
    });

    // Switch between Login and Signup
    showSignup.addEventListener('click', () => {
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    });

    showLogin.addEventListener('click', () => {
        signupSection.style.display = 'none';
        loginSection.style.display = 'block';
    });
});
