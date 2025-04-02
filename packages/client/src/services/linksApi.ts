import { api, Link, PaginationParams, PaginatedResponse } from './api';

interface GetLinksParams {
  page?: number;
  pageSize?: number;
}

export const linksApi = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Link>> => {
    const response = await api.get('/links', { params });
    return response.data;
  },

  create: async (data: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Promise<Link> => {
    const response = await api.post('/links', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/links/${id}`);
  },

  update: async (id: string, data: Partial<Link>): Promise<Link> => {
    const response = await api.put(`/links/${id}`, data);
    return response.data;
  },
}; 