import axios from 'axios';
import Cookies from 'js-cookie';
export const API_URL = 'http://localhost:3001'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})


$api.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    console.error(error + "error");
    if (error.response.status === 401 && error.config && !error.config._iRetry) {
        const originalRequest = error.config;
        originalRequest._iRetry = true;
        try {
            await axios.post(`${API_URL}/auth/refreshToken`, {}, { withCredentials: true });
            return $api.request(originalRequest);
        }
        catch (e) {
            console.error("Non authorized");
        }
    }
    throw error;
});

export default $api;