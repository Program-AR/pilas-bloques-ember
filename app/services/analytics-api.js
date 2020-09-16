import Service, { inject as service } from '@ember/service'
import config from "../config/environment"

const { baseURL, sessionExpire } = config.pbAnalyticsApi

export default Service.extend({
  ANALYTICS_KEY: 'PB_ANALYTICS_SESSION',
  platform: service(),

  openChallenge(challengeId) {
    const body = this._buildBody(challengeId)
    this._send('POST', 'challenges', body)
  },

  runProgram(challengeId, program, staticAnalysis) {
    const solutionId = uuidv4()
    const body = {
      solutionId,
      program,
      staticAnalysis,
      ...this._buildBody(challengeId)
    }

    this._send('POST', 'solutions', body)

    return solutionId
  },

  checkSessionId() {
    let session = JSON.parse(localStorage.getItem(this.ANALYTICS_KEY))
    const isOld = () => (new Date() - new Date(session.timestamp)) / 1000 / 60 > sessionExpire // Minutes
    if (!session || isOld()) return this._updateSession().id
    return session.id
  },

  _buildBody(challengeId) {
    const online = this.platform.online()
    const fingerprint = new ClientJS().getFingerprint()
    const sessionId = this.checkSessionId()
    return {
      challengeId,
      sessionId,
      online,
      browserId: fingerprint,
      userId: fingerprint,
      createdAt: new Date(),
    }
  },

  _updateSession() {
    const newSession = {
      id: uuidv4(),
      timestamp: new Date()
    }
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(newSession))
    return newSession
  },

  _send(method, resource, body) {
    const url = `${baseURL}/${resource}`

    return fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => { if (res.status > 200) return res.text() })
      .then((pbAnalyticsError) => { if (pbAnalyticsError) console.log({ pbAnalyticsError }) }) // Api error
      .catch((pbAnalyticsError) => console.log({ pbAnalyticsError })) // Connection error
  },
})
