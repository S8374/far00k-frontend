/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/services/auth.service.ts

import { api } from "./test.api";


export const authService = {
  async login(credentials: any): Promise<any> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },


};