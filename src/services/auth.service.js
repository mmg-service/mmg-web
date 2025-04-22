import api from './api'

class AuthService {
  async login(user) {
    const response = await api.post('/auth/login', {
      phoneNumber: user.phoneNumber,
      verificationCode: user.verificationCode
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

  async register(user) {
    return api.post('/auth/register', {
      phoneNumber: user.phoneNumber,
      verificationCode: user.verificationCode
    })
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'))
  }
}

export default new AuthService()