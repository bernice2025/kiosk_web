import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores/stockageLoc.js'
import '@fortawesome/fontawesome-free'
import axios from 'axios'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css';
// import 'vue-toast-notification/dist/theme-default.css';
import { Bar } from 'vue-chartjs'
import { getErrorMessage } from './errorHandler'

axios.defaults.baseURL = 'https://testbusiness.amidev.bi/api/';
// axios.defaults.baseURL = 'http://192.168.1.42:8000/api/';
//axios.defaults.baseURL = '/api/';

axios.interceptors.request.use((config) => {
    const token = store.state.user?.access;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})
window.axios = axios

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ToastPlugin)
app.use(Bar)
app.use({
    install(app) {
        app.config.globalProperties.$getErrorMessage = getErrorMessage;
    }
})


app.mixin({
    computed: {
        headers() {
            const headers = {
                headers: {
                    Authorization: `Bearer ${this.$store.state.user?.access || ''}`,
                }
            }
            return headers
        },
    },
    methods: {
        formatDate(date) {
            return !!date ? new Date(date).toLocaleDateString('fr-FR') : "-"
        },
        formatMontant(val) {
            if (val === null || val === undefined || isNaN(Number(val))) {
                return '-';
            };
            return this.formatNumber(Number(val));
        },

        formatNumber(num) {
            return new Intl.NumberFormat('fr-FR').format(num);
        },
        formatMontant(val) {
            if (val === null || val === undefined || isNaN(Number(val))) {
                return '-'
            }
            return this.formatNumber(Number(val))
        },
    }
})

app.mount('#app')