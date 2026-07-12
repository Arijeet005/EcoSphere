import { mockLogin, mockRegister } from './mockApi.js';

export const login = (payload) => mockLogin(payload);
export const register = (payload) => mockRegister(payload);
