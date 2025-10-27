import axios from "axios";
import BASE_API_URL from "../../services/base.api.url";

const api = axios.create({
    baseURL: BASE_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }

)

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (err) => {
        if (err.response && err.response.status === 401){
            console.err("Unauthorized! Log out....")
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export default api
