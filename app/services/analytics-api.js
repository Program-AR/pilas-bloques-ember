import Service, { inject as service } from '@ember/service'
import config from "../config/environment"

const { baseURL, sessionExpire } = config.pbAnalyticsApi

export default Service.extend({
  ANALYTICS_KEY: 'PB_ANALYTICS_SESSION',
  platform: service(),
  connected: true,

  openChallenge(challengeId) {
    this._send('POST', 'challenges', { challengeId })
  },

  runProgram(challengeId, program, staticAnalysis) {
    const solutionId = uuidv4()
    const data = {
      challengeId,
      solutionId,
      program,
      staticAnalysis,
    }

    this._send('POST', 'solutions', data)

    return solutionId
  },

  executionFinished(solutionId, executionResult) {
    this._send('PUT', `solutions/${solutionId}`, { executionResult })
  },


  checkSessionId() {
    let session = JSON.parse(localStorage.getItem(this.ANALYTICS_KEY))
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
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(newSession))
    return newSession
  },

  _send(method, resource, data) {
    if (!this.connected) { return; }
    const url = `${baseURL}/${resource}`
    const body = {
      ...data,
      session: this._buildSessionBody()
    }

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
