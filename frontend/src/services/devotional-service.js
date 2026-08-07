import api from './api';

const base = '/editor/devotionals';

const devotionalService = {
  list: () => api.get(base),
  get: (id) => api.get(`${base}/${id}`),
  create: (data) => api.post(base, data),
  update: (id, data) => api.put(`${base}/${id}`, data),
  delete: (id) => api.delete(`${base}/${id}`),
  publish: (id, body) => api.post(`${base}/${id}/publish`, body),
  schedule: (id, body) => api.post(`${base}/${id}/schedule`, body),
  upload: (formData) => api.post('/editor/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default devotionalService;
