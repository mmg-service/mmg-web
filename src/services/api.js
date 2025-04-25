import axios from 'axios'

// 현재 환경 가져오기
const BASE_URL = process.env.VUE_APP_API_URL;
const currentEnv = process.env.NODE_ENV || 'development';

// API 기본 설정
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
})

// 요청 인터셉터 설정
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('user-token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 개발 환경에서만 요청 로깅
    if (currentEnv === 'development') {
      console.log('API Request:', config);
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
    // 개발 환경에서만 응답 로깅
    if (currentEnv === 'development') {
      console.log('API Response:', response);
    }

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

export function requestWithBaseURL(baseURL) {
  const instance = axios.create({
    baseURL,
    timeout: Number(process.env.VUE_APP_TIMEOUT) || 10000
  })

  instance.interceptors.request.use(api.interceptors.request.handlers[0].fulfilled)
  instance.interceptors.response.use(api.interceptors.response.handlers[0].fulfilled, api.interceptors.response.handlers[0].rejected)

  return instance
}

export default api