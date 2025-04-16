import axios from 'axios';
import { authService } from './auth';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface Link {
  id: string;
  url: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface CreateLinkData {
  url: string;
  title: string;
  description?: string;
  tagIds?: string[];
}

export interface UpdateLinkData extends Partial<CreateLinkData> {}

export interface CreateTagData {
  name: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  tagIds?: string[];
}

export interface PaginatedResponse<T> {
  data: {
    links: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const linksApi = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Link>> => {
    const response = await api.get('/links', { params });
    return response.data;
  },

  getById: (id: string) => api.get<Link>(`/links/${id}`),

  create: async (data: CreateLinkData): Promise<{ data: Link }> => {
    const response = await api.post('/links', data);
    return response.data;
  },

  update: async (id: string, data: UpdateLinkData): Promise<{ data: Link }> => {
    const response = await api.put(`/links/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/links/${id}`);
  },
};

export const tagsApi = {
  getAll: async (): Promise<{ data: Tag[] }> => {
    const response = await api.get('/tags');
    return response.data;
  },

  create: async (data: CreateTagData): Promise<{ data: Tag }> => {
    const response = await api.post('/tags', data);
    return response.data;
  },

  update: async (id: string, data: CreateTagData): Promise<{ data: Tag }> => {
    const response = await api.put(`/tags/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
}; 