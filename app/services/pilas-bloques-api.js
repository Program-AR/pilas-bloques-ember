import Service, { inject as service } from '@ember/service'
import config from "../config/environment"

const { baseURL } = config.pbApi

export default Service.extend({
  SESSION_KEY: 'PB_SESSION',
  platform: service(),
  loading: {
    login: false,
    register: false,
  },
  connected: true,

  async login(credentials) {
    return this._send('POST', 'login', credentials)
      .then(session => this._saveSession(session))
  },

  async register(data) {
    const { username, avatarURL } = data
    const profile = {
      nickName: username,
      avatarURL
    }
    return this._send('POST', 'register', { ...data, profile })
      .then(session => this._saveSession(session))
  },

  async validateUsername(username) {
    return this._send('GET', `register/check?username=${username}`)
  },

  logout() {
    return this._saveSession(null)
  },

  getSession() {
    return JSON.parse(localStorage.getItem(this.SESSION_KEY))
  },

  _saveSession(session) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session || null))
  },

  async _send(method, resource, body) {
    if (!this.connected) { return; }
    const url = `${baseURL}/${resource}`
    
    const flag = `loading.${resource}`
    this.set(flag, true)
    return fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => { if (res.status >= 400) { throw res.text() } else return res.json() })
      .catch((pbApiError) => {
        console.log({ pbApiError }) //TODO: Toast
        throw pbApiError
      })
      .finally(() => this.set(flag, false))
  },
})
