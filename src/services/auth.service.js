import { requestWithBaseURL } from './api'
const memberApi = requestWithBaseURL(process.env.VUE_APP_MEMBER_API_URL)

class AuthService {
  async login(user) {
    console.log('Using baseURL:', process.env.VUE_APP_MEMBER_API_URL)

    const response = await memberApi.post('/auth/login', {
      username: user.username,
      password: user.password
    })
    
    if (response.data.token) {
      localStorage.setItem('user-token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data.user
  }

  logout() {
    localStorage.removeItem('user-token')
    localStorage.removeItem('user')
  }

  async signup(user) {
    const response = await memberApi.post('/auth/signup', {
      username: user.username,
      password: user.password
    })

    return response
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'))
  }
}

export default new AuthService()