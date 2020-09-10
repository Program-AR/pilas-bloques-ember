import Service from '@ember/service'
import config from "../config/environment"

const ANALYTICS_KEY = 'PB_ANALYTICS_SESSION'

export default Service.extend({
  openChallenge(challengeId) {
    const online = typeof process === "undefined" //TODO: Mover a un service y reemplazar a todos los lugares donde se usa.
    const url = 'http://localhost:3000/challenges' //TODO: config
    const fingerprint = new ClientJS().getFingerprint()
    const sessionId = this.checkSessionId()

    const body = {
      challengeId,
      online,
      sessionId,
      browserId: fingerprint,
      userId: fingerprint,
      createdAt: new Date(),
    }
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => { if (res.status > 200) return res.text() })
      .then((pbAnalyticsError) => { if (pbAnalyticsError) console.log({ pbAnalyticsError }) }) // Api error
      .catch((pbAnalyticsError) => console.log({ pbAnalyticsError })) // Connection error

  },

  checkSessionId() {
    let session = JSON.parse(localStorage.getItem(ANALYTICS_KEY))
    const isOld = () => (new Date() - new Date(session.timestamp)) / 1000 / 60 > 30 // Minutes // TODO: config 
    if (!session || isOld()) return this.updateSession().id
    return session.id
  },

  updateSession() {
    const newSession = {
      id: uuidv4(),
      timestamp: new Date()
    }
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(newSession))
    return newSession
  }
})
