import axios from 'axios';
import $api from '../https/axios';
import { API_URL } from '../https/axios';
import toast from 'react-hot-toast';
import { getUserCountryCode, userCountryCode } from '@/lib/userCountryCode';

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
        //try adding await
        return $api.get(`${API_URL}/organization/get-events/${id}?limit=${limit}&page=${page}`);
    }

    static async getEvent(id) {
        return $api.get(`${API_URL}/events/get-event/${id}`);
    }
    static async getUpcomingEvents() {
        const now = new Date();
        // const pastWeek = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7);
        const nextWeek = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
        return await $api.get('/events/get-events', {
            params: {
                countryCode: await getUserCountryCode(),
                startDate: now.toISOString(),
                endDate: nextWeek.toISOString(),
            }
        })
    }

    static async updateEvent(id, data) {
        try {
            const response = await $api.patch(`${API_URL}/events/${id}`, data);
            return response;
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }
}

