import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://phd-backend-tkru.onrender.com/api',
    timeout: 15000,
})

export default api