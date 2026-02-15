import api from './api'

const getData = (response) => response?.data?.data

const trySequential = async (requests) => {
  let lastError

  for (const request of requests) {
    try {
      return await request()
    } catch (error) {
      lastError = error

      const status = error?.response?.status
      if (status && status !== 404) {
        throw error
      }
    }
  }

  throw lastError || new Error('Request failed')
}

export const loginAdmin = async (payload) => {
  const response = await api.post('/admin/login', payload)
  return getData(response)
}

export const fetchParticipantSummaries = async () => {
  const response = await trySequential([
    () => api.get('/admin/records'),
    () => api.get('/admin/participants/summaries'),
  ])

  return getData(response) || []
}

export const fetchParticipantDetail = async (participantId) => {
  const response = await trySequential([
    () => api.get(`/admin/participant/${participantId}`),
    () => api.get(`/admin/participants/${participantId}`),
  ])

  return getData(response)
}

export const exportParticipantCsv = async () => {
  const response = await trySequential([
    () => api.get('/admin/export', { responseType: 'blob' }),
    () => api.get('/admin/export/csv', { responseType: 'blob' }),
  ])

  return response.data
}