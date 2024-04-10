import axios from 'axios';
import $api from '../https/axios';
import { API_URL } from '../https/axios';
import toast from 'react-hot-toast';

export default class UserService {

    static async getUserArtists() {
        try {
            const response = await $api.get(`${API_URL}/artists/user-following-artists`, {}, { withCredentials: true });
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async searchArtists(query) {
        try {
            const response = await $api.get(`${API_URL}/info/get-artist/${query}`, {}, { withCredentials: true });
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }
}
