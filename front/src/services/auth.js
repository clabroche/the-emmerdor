import axios from './axios'
export default {
  token: localStorage.getItem('token'),
  async login(password) {
    const { data: token } = await axios.post('/auth', { password })
      .catch(() => ({data: null}))
    if(token) {
      this.token = token
      localStorage.setItem('token', token)
    }
    return token
  },
  async isTokenValid() {
    if(!this.token) return false
    const {data: isTokenValid} = await axios.post('/auth/is-token-valid', null, {
      headers: { token: this.token}
    })
    if(!isTokenValid) {
      this.token = ''
      localStorage.setItem('token', '')
    }
    return isTokenValid
  }
}