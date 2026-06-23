// frontend/src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
    withCredentials: true, // Include cookies in requests
    headers: {
        'Content-Type': 'application/json',
    }
});