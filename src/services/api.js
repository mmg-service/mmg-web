import axios from 'axios'

// API 기본 설정
const api = axios.create({
  baseURL: 'http://localhost:8080/v1',
  timeout: 10000
})

// 요청 인터셉터 설정
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('user-token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 설정
api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 인증 오류 처리
      localStorage.removeItem('user-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api