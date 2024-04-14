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

    static async checkAuth(accessTokenObj, refreshTokenObj) {
        try {
            // Убедитесь, что значения accessToken и refreshToken являются строками
            const accessToken = accessTokenObj.value;
            const refreshToken = refreshTokenObj.value;
            const cookieString = `accessToken=${accessToken}; refreshToken=${refreshToken}`;
            const response = await axios.post(`${API_URL}/auth/refreshToken`, {}, {
                headers: {
                    'Cookie': cookieString
                },
                withCredentials: true
            });
            return response;
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    static async logout() {
        try {
            const response = await $api.post(`${API_URL}/auth/logout`);
            return response;
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }
}
