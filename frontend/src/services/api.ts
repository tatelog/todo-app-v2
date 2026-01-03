import axios from 'axios';
import { Todo, Category, Tag } from '../types';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const todoApi = {
  getAll: () => api.get<Todo[]>('/todos').then(res => res.data),
  getById: (id: string) => api.get<Todo>(`/todos/${id}`).then(res => res.data),
  create: (todo: Partial<Todo>) => api.post<Todo>('/todos', todo).then(res => res.data),
  update: (id: string, todo: Partial<Todo>) => api.patch<Todo>(`/todos/${id}`, todo).then(res => res.data),
  delete: (id: string) => api.delete(`/todos/${id}`).then(res => res.data)
};

export const categoryApi = {
  getAll: () => api.get<Category[]>('/categories').then(res => res.data),
  create: (category: Partial<Category>) => api.post<Category>('/categories', category).then(res => res.data),
  update: (id: string, category: Partial<Category>) => api.patch<Category>(`/categories/${id}`, category).then(res => res.data),
  delete: (id: string) => api.delete(`/categories/${id}`).then(res => res.data)
};

export const tagApi = {
  getAll: () => api.get<Tag[]>('/tags').then(res => res.data),
  create: (tag: Partial<Tag>) => api.post<Tag>('/tags', tag).then(res => res.data),
  update: (id: string, tag: Partial<Tag>) => api.patch<Tag>(`/tags/${id}`, tag).then(res => res.data),
  delete: (id: string) => api.delete(`/tags/${id}`).then(res => res.data)
};
