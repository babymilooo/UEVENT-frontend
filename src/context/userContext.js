const { default: AuthService } = require("@/service/authService");
import { makeAutoObservable, runInAction } from 'mobx';

class UserStore {
    user = {
        userName: "",
        id: "",
        // image: null,
        email: "",
        isVerified: false
    };

    isLoggedIn = false;
    constructor(user, rootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
        this.user = user || this.user;
    }

    setUser(user) {
        this.user = user;
    }

    setLoggedIn(value) {
        this.isLoggedIn = value;
    }

    async checkAuth() {
        try {
            const response = await AuthService.checkAuth();
            runInAction(() => {
                this.setUser(response.data);
                this.setLoggedIn(true);
            });
            return response;
        } catch (e) {
            console.error(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            runInAction(() => {
                this.setUser(response.data);
                this.setLoggedIn(true);
            });
            return response;
        }
        catch (e) {
            console.error(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async registration(email, password) {
        try {
            const response = await AuthService.register(email, password);
            runInAction(() => {
                this.setUser(response.data);
                this.setLoggedIn(true);
            });
            return response;
        }
        catch (e) {
            console.error(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            this.setUser({ username: null, id: null, email: null });
            this.setLoggedIn(false);
            return true;
        }
        catch (e) {
            console.error(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }
}

export default UserStore;
