import api from './axiosInstance';

export const fetchMetrics = () => api.get('/metrics');
export const createMetric = (payload) => api.post('/metrics', payload);
