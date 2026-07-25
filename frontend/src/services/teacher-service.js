import api from './api';

export const teacherService = {
  getStats: () => api.get('/teacher/stats'),
  getStudents: () => api.get('/teacher/students'),
  getAssignments: () => api.get('/teacher/assignments'),
  getSubmissions: () => api.get('/teacher/submissions'),
};
