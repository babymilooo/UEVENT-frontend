import axios from 'axios';
import $api from '../https/axios';
import { API_URL } from '../https/axios';
import toast from 'react-hot-toast';

export default class ArtistService {

    static async getUserArtists() {
        try {
            const response = await $api.get(`${API_URL}/artists/user-following-artists`);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async searchArtists(query) {
        try {
            const response = await $api.get(`${API_URL}/artists/get-artist`, { params: { artistName: query } }, { withCredentials: true });
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async getArtists(artistIds) {
        try {
            const response = await $api.post(`${API_URL}/artists/get-artists`, {artistIds});
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }
}
