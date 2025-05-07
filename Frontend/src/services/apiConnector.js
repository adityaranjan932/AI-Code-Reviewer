import axios from "axios";

// Use import.meta.env for Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Crucial for sending/receiving cookies
});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
};