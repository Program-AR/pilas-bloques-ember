import Service, { inject as service } from '@ember/service'
import config from "../config/environment"

const { baseURL } = config.pbApi

export default Service.extend({
  SESSION_KEY: 'PB_SESSION',
  platform: service(),
  connected: true,

  async login(credentials) {
    return this._send('POST', 'login', credentials)
      .then((res) => {
        if (res.status >= 400) throw res.text()
        else this._saveSession(res.json())
      })
  },

  register(data) {
    const { username, avatarURL } = data
    const credentials = data
    const profile = {
      nickName: username,
      avatarURL
    }
    return this._send('POST', 'register', { credentials, profile })
  },

  checkSessionId() {
    let session = JSON.parse(localStorage.getItem(this.SESSION_KEY))
    const isOld = () => (new Date() - new Date(session.timestamp)) / 1000 / 60 > sessionExpire // Minutes
    if (!session || isOld()) return this._updateSession().id
    return session.id
  },

  _saveSession(session) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
  },

  async _send(method, resource, body) {
    if (!this.connected) { return; }
    const url = `${baseURL}/${resource}`

    return fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    // .then((res) => { if (res.status > 200) return res.json() })
    // .catch((pbApiError) => console.log({ pbApiError })) // Connection error
  },
})
