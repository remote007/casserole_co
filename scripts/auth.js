const API_URL = "https://casserolecoserver.glitch.me/users";

export const auth = {
 isLoggedIn() {
        return sessionStorage.getItem("user") != null;
    },

    async getUsername() {
        const user = JSON.parse(sessionStorage.getItem("user"));
        return user ? user.username : null;
    },

    async login(username, password) {
        const response = await fetch(`${API_URL}?username=${username}`);
        const users = await response.json();

        if (users.length == 0) {
            throw new Error("User not found.");
        }

        const user = users.find((u) => u.password == password);
        if (user) {
            sessionStorage.setItem("user", JSON.stringify(user));
            return user;
        } else {
            throw new Error("Incorrect password.");
        }
    },

    async signup(username, password) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Signup failed.");
        }
    },

    logout() {
        sessionStorage.removeItem("user");
    }
};
