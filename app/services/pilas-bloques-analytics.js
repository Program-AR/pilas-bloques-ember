import Service, { inject as service } from '@ember/service'
import config from "../config/environment"

const { sessionExpire } = config.pbAnalytics

export default Service.extend({
  ANALYTICS_KEY: 'PB_ANALYTICS_SESSION',
  platform: service(),

  buildSession(userId) {
    const online = this.platform.online()
    const fingerprint = new ClientJS().getFingerprint()
    const session = this.getSession()
    return {
      ...session,
      online,
      browserId: fingerprint,
      userId: userId || fingerprint,
      timestamp: new Date(),
      context: [], // Survey TODO: Buscar nomber
    }
  },

  newAnswer(data) {
    const session = this.getSession()
    const answers = session.answers || []
    answers.push(data)
    this._save({ ...session, answers })
  },

  _newSession() {
    const newSession = {
      id: uuidv4(),
      timestamp: new Date(),
      answers: []
    }
    this._save(newSession)
    return newSession
  },

  getSession() {
    const data = localStorage.getItem(this.ANALYTICS_KEY)
    if (!data) return this._newSession()
    const session = JSON.parse(data)
    return this._isOld(session) ? this._newSession() : session
  },

  _isOld({ timestamp }) { return (new Date() - new Date(timestamp)) / 1000 / 60 > sessionExpire }, // Minutes

  _save(session) {
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(session))
  }
})
