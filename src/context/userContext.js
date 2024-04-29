const { default: AuthService } = require("@/service/authService");
import UserService from '@/service/userService';
import { makeAutoObservable, runInAction } from 'mobx';

class UserStore {
    user = {
        userName: "",
        id: "",
        profilePicture: null,
        email: "",
        isVerified: false
    };

    isLoggedIn = false;
    userArtists = [];
    constructor(user, rootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
        this.user = user || this.user;
    }

    setUser(user) {
        this.user = user;
    }

    setProfilePicture(picture) {
        this.user.profilePicture = picture;
    }
    setLoggedIn(value) {
        this.isLoggedIn = value;
    }

    setArtists(artists) {
        this.userArtists = artists;
    }

    async checkAuth() {
        try {
            const response = await AuthService.checkAuth();
            runInAction(() => {
                this.setUser(response.data);
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
            this.setUser({ username: null, id: null, email: null, profilePicture: null, isVerified: false });
            this.setLoggedIn(false);
            this.setArtists([]);
            return true;
        }
        catch (e) {
            console.error(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async authSpotify() {
        try {
            const response = await AuthService.authSpotify();
            return response;
        } catch (e) {
            console.error(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async getUserArtists() {
        try {
            const response = await UserService.getUserArtists();
            runInAction(() => {
                this.setArtists(response.data);
            });
            return response;
        } catch (e) {
            console.error(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async deleteAccount() {
        try {
            await UserService.deleteAccount();
            this.setUser({ username: null, id: null, email: null, profilePicture: null, isVerified: false });
            this.setLoggedIn(false);
            this.setArtists([]);
        } catch (e) {
            console.error(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async updateUser(userData, picture) {
        try {
            const response = await UserService.editProfile(userData);
            const pictureRes = await UserService.editUserAvatar(picture);
            console.log(pictureRes, 'pictureRes');
            console.log(response, 'response');
            runInAction(() => {
                this.setUser(response.data);
                this.setProfilePicture(pictureRes.data.profilePicture);
            });
            return response;
        } catch (e) {
            console.error(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }
}

export default UserStore;
