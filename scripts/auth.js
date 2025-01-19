const API_URL = "https://casserolecoserver.glitch.me/";

export const auth = {
    // Login function for admin or customer
    async login(identifier, password, authType) {
        try {
            // Fetch users based on authType (admin or customer)
            const response = await fetch(`${API_URL}${authType}`);
            const data = await response.json();

            const users = data; // Choose the correct array based on authType

            // For admin: Find by empid
            if (authType === 'admin') {
                const admin = users.find((u) => u.empid === identifier);

                if (!admin) {
                    throw new Error("Employee ID not found.");
                }

                if (admin.password !== password) {
                    throw new Error("Incorrect password.");
                }

                // Set the admin in sessionStorage
                sessionStorage.setItem('user', admin.email);
                return admin;
            }

            // For customer: Find by email
            if (authType === 'customer') {
                const customer = users.find((u) => u.email === identifier);

                if (!customer) {
                    throw new Error("Email not found.");
                }

                if (customer.password !== password) {
                    throw new Error("Incorrect password.");
                }

                // Set the customer in sessionStorage
                sessionStorage.setItem('user', customer.email);
                return customer;
            }

            throw new Error("Invalid auth type.");
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed.');
        }
    },

    // Signup function for admin or customer
    async signup(data, authType) {
        try {
            // const response = await fetch(`${API_URL}/${authType}`);
            const response = await fetch(`${API_URL}${authType}`);
            const dataFromDB = await response.json();

            const users = dataFromDB; // Array containing admin or customer users
            let user;
            if (authType === 'admin') {
                const adminExists = users.find((u) => u.empid === data.empid);
                if (adminExists) {
                    throw new Error("Admin with this Employee ID already exists.");
                }
                user = {
                    id : users.length+1,
                    email : data.email,
                    username : data.username,
                    password : data.password,
                    empid : data.empid
                }; // Add new admin to the admin array
            } else if (authType === 'customer') {
                const customerExists = users.find((u) => u.email === data.email);
                if (customerExists) {
                    throw new Error("Customer with this email already exists.");
                }
                user = {
                    'id' : users.length+1,
                    'email' : data.email,
                    'username' : data.username,
                    'password' : data.password,
                    'address' : data.address,
                    'phone' : data.phone
                } // Add new customer to the customer array
            }
            console.log(`${API_URL}${authType}`)
            console.log(user);
            const responseUpdate = await fetch(`${API_URL}${authType}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: (user), // Update the whole users object
            });

            if (responseUpdate.ok) {
                return responseUpdate.json();
            } else {
                throw new Error('Signup failed.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            throw new Error('Signup failed.');
        }
    },

    logout() {
        sessionStorage.removeItem('user');
    },
};
