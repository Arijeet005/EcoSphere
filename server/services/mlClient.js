import axios from 'axios';

const DEFAULT_ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const buildClient = () => axios.create({
  baseURL: DEFAULT_ML_SERVICE_URL,
  timeout: 3000,
});

export const getEsgScore = async (metrics) => {
  try {
    const response = await buildClient().post('/score', metrics);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || 'ML service unavailable';
    throw new Error(`Unable to reach ML service: ${message}`);
  }
};

export const checkAnomaly = async (data) => {
  try {
    const response = await buildClient().post('/anomaly-check', data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || 'ML service unavailable';
    throw new Error(`Unable to reach ML service: ${message}`);
  }
};
