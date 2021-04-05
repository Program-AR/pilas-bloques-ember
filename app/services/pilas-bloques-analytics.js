import Service, { inject as service } from '@ember/service'
import config from "../config/environment"

const { sessionExpire } = config.pbAnalytics

//TODO: Rename 'Analytics' to 'session' related approach
export default Service.extend({
  platform: service(),
  storage: service(),

  context() {
    const userId = this.storage.getUserId()
    const online = this.platform.online()
    const fingerprint = new ClientJS().getFingerprint()
    const session = this.getSession()
    return {
      ...session,
      online,
      browserId: fingerprint,
      userId: userId || fingerprint,
    }
  },

  newAnswer(data) {
    const session = this.getSession()
    const answers = session.answers || []
    answers.push(data)
    this.storage.saveAnalyticsSession({ ...session, answers })
  },

  _newSession() {
    const newSession = {
      id: uuidv4(),
      firstInteraction: new Date(),
      answers: []
    }
    this.storage.saveAnalyticsSession(newSession)
    return newSession
  },

  getSession() {
    const session = this.storage.getAnalyticsSession()
    if (!session) return this._newSession()
    return this._isOld(session) ? this._newSession() : session
  },

  logout() {
    this.storage.saveAnalyticsSession(null)
  },

  _isOld({ firstInteraction }) { return (new Date() - new Date(firstInteraction)) / 1000 / 60 > sessionExpire }, // Minutes
})
