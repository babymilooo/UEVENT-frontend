import axios from 'axios';
import $api from '../https/axios';
import { API_URL } from '../https/axios';
import toast from 'react-hot-toast';

export default class EventService {

    static async createEvent(data) {
        try {
            const response = await $api.post(`${API_URL}/events/create`, data);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async updatePicture(id, picture) {
        const formData = new FormData();
        formData.append('picture', picture);
        try {
            const response = await axios.patch(`${API_URL}/download/media/event/${id}?mediaType=picture`, formData, {
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

    static async createTicket(data) {
        try {
            const response = await $api.post(`${API_URL}/ticketOptions/create`, data);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    static async getEvents(id, limit, page) {
        return $api.get(`${API_URL}/organization/get-events/${id}?limit=${limit}&page=${page}`);
    }

    static async getEvent(id) {
        return $api.get(`${API_URL}/events/get-event/${id}`);
    }
}