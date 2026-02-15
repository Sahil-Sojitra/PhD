import api from './api'

export const submitTestResult = (payload) => api.post('/tests/final/submit', payload)