import Service from '@ember/service'
import config from "../config/environment"

export default Service.extend({
  openChallenge(challengeId) {
    const url = 'http://localhost:3000/challenges' //TODO: config
    const fingerprint = new ClientJS().getFingerprint()
    const body = {
      challengeId,
      timestamp: new Date(),
      online: typeof process === "undefined", //TODO: Mover a un service y reemplazar a todos los lugares donde se usa.
      browserId: fingerprint,
      userId: fingerprint
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
})
