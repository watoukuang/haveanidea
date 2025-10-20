import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

const request: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

request.interceptors.request.use((config: AxiosRequestConfig) => {
    return config;
});

request.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError<any>) => {
        const message = (error.response?.data as any)?.message || error.message || 'Request Error';
        return Promise.reject(new Error(message));
    },
);

export default request;
