export const auth = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    username: localStorage.getItem('username') || null,

    login(username) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        this.isLoggedIn = true;
        this.username = username;
    },

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        this.isLoggedIn = false;
        this.username = null;
    }
};
