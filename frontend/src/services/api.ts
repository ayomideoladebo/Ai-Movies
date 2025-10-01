import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

// TMDB API
export const searchContent = async (query: string) => {
  const response = await api.get(`/tmdb/search?q=${encodeURIComponent(query)}&type=multi`)
  return response.data
}

export const getMovieDetails = async (id: string) => {
  const response = await api.get(`/tmdb/movie/${id}`)
  return response.data
}

export const getTVDetails = async (id: string) => {
  const response = await api.get(`/tmdb/tv/${id}`)
  return response.data
}

export const getTrending = async (type: string = 'all', timeWindow: string = 'week') => {
  const response = await api.get(`/tmdb/trending?type=${type}&time_window=${timeWindow}`)
  return response.data
}

export const discoverContent = async (type: string = 'movie', params: any = {}) => {
  const response = await api.get(`/tmdb/discover?type=${type}`, { params })
  return response.data
}

// Weather API
export const getWeather = async (lat: number, lon: number) => {
  const response = await api.get(`/weather?lat=${lat}&lon=${lon}`)
  return response.data
}

export const getWeatherByCity = async (city: string) => {
  const response = await api.get(`/weather/city?city=${encodeURIComponent(city)}`)
  return response.data
}

// Gemini API
export const chatWithGemini = async (prompt: string, context: any = {}) => {
  const response = await api.post('/gemini/chat', { prompt, context })
  return response.data
}

export const getGeminiRecommendations = async (mood: string, context: any = {}) => {
  const response = await api.post('/gemini/recommendations', { mood, context })
  return response.data
}

// Auth API
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const register = async (email: string, password: string) => {
  const response = await api.post('/auth/register', { email, password })
  return response.data
}

export const logout = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const updateWatchlist = async (watchlist: any[]) => {
  const response = await api.put('/auth/watchlist', { watchlist })
  return response.data
}

// Paystack API
export const initializePayment = async (amount: number, email: string) => {
  const response = await api.post('/paystack/init', { amount, email })
  return response.data
}

export const verifyPayment = async (reference: string) => {
  const response = await api.get(`/paystack/verify/${reference}`)
  return response.data
}

export const getPaymentHistory = async () => {
  const response = await api.get('/paystack/history')
  return response.data
}

// Admin API
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats')
  return response.data
}

export const getUsers = async (page: number = 1, limit: number = 20) => {
  const response = await api.get(`/admin/users?page=${page}&limit=${limit}`)
  return response.data
}

export const updateUserSubscription = async (userId: string, subscriptionStatus: string) => {
  const response = await api.put(`/admin/users/${userId}/subscription`, { subscriptionStatus })
  return response.data
}

export const getContentOverrides = async () => {
  const response = await api.get('/admin/content')
  return response.data
}

export const updateContentOverride = async (data: any) => {
  const response = await api.post('/admin/content', data)
  return response.data
}

export const deleteContentOverride = async (id: string) => {
  const response = await api.delete(`/admin/content/${id}`)
  return response.data
}

export const getAdminLogs = async (page: number = 1, limit: number = 50) => {
  const response = await api.get(`/admin/logs?page=${page}&limit=${limit}`)
  return response.data
}
