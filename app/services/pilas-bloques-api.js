import Service, { inject as service } from '@ember/service'
import config from "../config/environment"

const { baseURL } = config.pbApi

export default Service.extend({
  SESSION_KEY: 'PB_SESSION',
  paperToaster: service(),
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
      .catch(pbApiError => {
        this._alertServerError()
        // console.log({ pbApiError })
        throw pbApiError
      })
      .then(res => {
        if (res.status >= 400) throw { status: res.status, message: res.text() }
        return res.json()
      })
      .finally(() => this.set(flag, false))
  },

  _alertServerError() {
    this.paperToaster.show("Problemas con el servidor, intentar más tarde", {
      duration: 4000,
      position: "top"
    })
  },
})
