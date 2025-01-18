const API_URL = "https://casserolecoserver.glitch.me/users";

export const auth = {
    async login(username, password, authType, empid = '') {
        const response = await fetch(`${API_URL}/${authType}`);
        const users = await response.json();

        const user = users.find(
            (u) => u.username === username && u.password === password && (authType !== 'admin' || u.empid === empid)
        );

        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
            return user;
        } else {
            throw new Error("Invalid credentials.");
        }
    },

    async signup(data, authType) {
        const response = await fetch(`${API_URL}/${authType}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Signup failed.");
        }
    },

    logout() {
        sessionStorage.removeItem('user');
    },
};
