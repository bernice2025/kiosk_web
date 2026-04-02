import axios from 'axios'
import store from './stores/stockageLoc.js'

axios.defaults.baseURL = 'https://testbusiness.amidev.bi/api/';
// axios.defaults.baseURL = 'http://192.168.1.42:8000/api/';
//axios.defaults.baseURL = '/api/';

axios.interceptors.request.use((config) => {
    const token = store.state.user?.access;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => Promise.reject(error)
)

window.axios = axios


export default axios