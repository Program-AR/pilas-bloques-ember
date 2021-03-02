import Service, { inject as service } from '@ember/service'
import config from "../config/environment"

const { sessionExpire } = config.pbAnalytics

export default Service.extend({
  ANALYTICS_KEY: 'PB_ANALYTICS_SESSION',
  platform: service(),

  checkSessionId() {
    let session = this.getSession()
    const isOld = () => (new Date() - new Date(session.timestamp)) / 1000 / 60 > sessionExpire // Minutes
    if (!session || isOld()) return this._newSession().id
    return session.id
  },

  buildSession(userId) {
    const online = this.platform.online()
    const fingerprint = new ClientJS().getFingerprint()
    const sessionId = this.checkSessionId()
    return {
      sessionId,
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
    return JSON.parse(localStorage.getItem(this.ANALYTICS_KEY))
  },

  _save(session) {
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(session))
  }
})
