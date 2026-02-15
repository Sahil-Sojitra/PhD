import api from './api'

export const createParticipant = (payload) => api.post('/participants', payload)