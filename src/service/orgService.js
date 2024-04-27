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

    static async addLogoToOrg(id, logo) {
        const formData = new FormData();
        formData.append('logo', logo);
        try {
            const response = await axios.patch(`${API_URL}/download/media/organization/${id}?mediaType=logo`, formData, {
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

    static async addBgToOrg(id, picture) {
        const formData = new FormData();
        formData.append('picture', picture);
        try {
            const response = await axios.patch(`${API_URL}/download/media/organization/${id}?mediaType=picture`, formData, {
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

    static async getOrganizations() {
        try {
            const response = await $api.get(`${API_URL}/organization/get-my-organizations`);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async getOrganization(id) {
        try {
            const response = await $api.get(`${API_URL}/organization/get-organization/${id}`);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async editOrganization(id, data) {
        try {
            const response = await $api.patch(`${API_URL}/organization/edit-organization/${id}`, data);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async deleteOrganization(id) {
        try {
            const response = await $api.delete(`${API_URL}/organization/delete-organization/${id}`);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }
}
