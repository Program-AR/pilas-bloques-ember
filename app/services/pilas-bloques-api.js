import Service, { inject as service } from '@ember/service'
import config from "../config/environment"

const { baseURL } = config.pbApi

export default Service.extend({
  SESSION_KEY: 'PB_SESSION',
  platform: service(),
  connected: true,

  login(credentials) {
    return this._send('POST', 'login', credentials)
  },

  checkSessionId() {
    let session = JSON.parse(localStorage.getItem(this.SESSION_KEY))
    const isOld = () => (new Date() - new Date(session.timestamp)) / 1000 / 60 > sessionExpire // Minutes
    if (!session || isOld()) return this._updateSession().id
    return session.id
  },

  _buildSessionBody() {
    const online = this.platform.online()
    const fingerprint = new ClientJS().getFingerprint()
    const sessionId = this.checkSessionId()
    return {
      sessionId,
      online,
      browserId: fingerprint,
      userId: fingerprint,
      timestamp: new Date(),
    }
  },

  _updateSession() {
    const newSession = {
      id: uuidv4(),
      timestamp: new Date()
    }
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(newSession))
    return newSession
  },

  _send(method, resource, body) {
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
