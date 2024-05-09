import axios from 'axios';
import $api from '../https/axios';
import { API_URL } from '../https/axios';
import toast from 'react-hot-toast';
export default class AuthService {
    static async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async register(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { email, password }, { withCredentials: true });
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async authSpotify() {
        try {
            const response = await axios.get(`${API_URL}/auth/spotify-auth`, {}, { withCredentials: true });
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async verifySpotify(code, state) {
        try {
            const response = await axios.get(`${API_URL}/auth/callback?code=${code}&state=${state}`, { withCredentials: true });
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async checkAuth() {
        try {
            const response = await axios.post(`${API_URL}/auth/refreshToken`, {}, { withCredentials: true });
            return response;
        } catch (e) {
            // console.error(e.response?.data?.message);
        }
    }

    static async checkToken() {
        try {
            const response = await $api.get(`${API_URL}/auth/check-auth`);
            return response;
        } catch (e) {
            console.error(e.response?.data?.message);
        }
    }

    static async logout() {
        try {
            const response = await $api.post(`${API_URL}/auth/logout`);
            return response;
        } catch (e) {
            console.error(e.response?.data?.message);
        }
    }
}
