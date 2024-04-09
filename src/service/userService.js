import axios from 'axios';
import $api from '../https/axios';
import { API_URL } from '../https/axios';
import toast from 'react-hot-toast';

export default class UserService {

    static async getUserArtists(id) {
        try {
            const response = await $api.get(`${API_URL}/info/user-following-artists/${id}`, {}, { withCredentials: true });
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }
}
