import { api } from './api';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name?: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken() {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
}; 