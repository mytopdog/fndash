import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' ? 'localhost:5000/api' : '/api';

export const apiBase = axios.create({
  baseURL: process.env.BASE_URL || BASE_URL,
});

export default {
  // Added api calls here
  // getSomething: () => apiBase.get(url),
};