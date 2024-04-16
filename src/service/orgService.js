import axios from 'axios';
import $api from '../https/axios';
import { API_URL } from '../https/axios';
import toast from 'react-hot-toast';

export default class OrganizationService {

    static async createOrganization(data) {
        try {
            const response = await $api.post(`${API_URL}/organization/create-organization`, data);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async getOrganizations() {
        try {
            const response = await $api.get(`${API_URL}/organization/get-organizations`);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }
}
