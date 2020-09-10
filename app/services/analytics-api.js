import Service from '@ember/service'
import config from "../config/environment"

const { baseURL, sessionExpire } = config.pbAnalyticsApi

export default Service.extend({
  ANALYTICS_KEY: 'PB_ANALYTICS_SESSION',

  openChallenge(challengeId) {
    const url = `${baseURL}/challenges`
    const body = this.buildBody(challengeId)

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => { if (res.status > 200) return res.text() })
      .then((pbAnalyticsError) => { if (pbAnalyticsError) console.log({ pbAnalyticsError }) }) // Api error
      .catch((pbAnalyticsError) => console.log({ pbAnalyticsError })) // Connection error

  },

  buildBody(challengeId) {
    const online = typeof process === "undefined" //TODO: Mover a un service y reemplazar a todos los lugares donde se usa.
    const fingerprint = new ClientJS().getFingerprint()
    const sessionId = this.checkSessionId()

    return {
      challengeId,
      online,
      sessionId,
      browserId: fingerprint,
      userId: fingerprint,
      createdAt: new Date(),
    }
  },

  checkSessionId() {
    let session = JSON.parse(localStorage.getItem(this.ANALYTICS_KEY))
    const isOld = () => (new Date() - new Date(session.timestamp)) / 1000 / 60 > sessionExpire // Minutes
    if (!session || isOld()) return this.updateSession().id
    return session.id
  },

  updateSession() {
    const newSession = {
      id: uuidv4(),
      timestamp: new Date()
    }
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(newSession))
    return newSession
  }
})
