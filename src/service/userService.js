import axios from 'axios';
import $api from '../https/axios';
import { API_URL } from '../https/axios';
import toast from 'react-hot-toast';

export default class UserService {

    static async getUserArtists() {
        try {
            const response = await $api.get(`${API_URL}/artists/user-following-artists`);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async getUserInfo() {
        try {
            const response = await $api.get(`${API_URL}/user/user-info`);
            return response;
        } catch (e) {
            console.error(e.response?.data?.message);

            // toast.error(e.response?.data?.message);
        }
    }

    static async getUserInfoById(id) {
        try {
            const response = await $api.get(`${API_URL}/user/user-info/${encodeURIComponent(id)}`);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }
    // static async searchArtists(query) {
    //     try {
    //         const response = await $api.get(`${API_URL}/artists/get-artist`, { params: { artistName: query } }, { withCredentials: true });
    //         return response;
    //     } catch (e) {
    //         toast.error(e.response?.data?.message);
    //     }
    // }

    static async deleteAccount() {
        try {
            const response = await $api.delete(`${API_URL}/user/delete-account`);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async editProfile(userData) {
        try {
            const response = await $api.patch(`${API_URL}/user/edit-profile`, userData);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async editUserAvatar(picture) {
        const formData = new FormData();
        formData.append('avatar', picture);
        try {
            const response = await axios.patch(`${API_URL}/user/edit-profile-avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }

    }
}
