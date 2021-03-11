import Service, { inject as service } from '@ember/service'
import config from "../config/environment"

const { baseURL } = config.pbApi
const log = () => { } // console.log

const logger = topic => message => log(topic, message)

export default Service.extend({
  storage: service(),
  paperToaster: service(),
  pilasBloquesAnalytics: service(),
  loading: { },
  connected: true,

  // SOLUTIONS
  openChallenge(challengeId) {
    this._send('POST', 'challenges', { challengeId }, false).catch(logger('openChallenge'))
  },

  savedSolution(challengeId) {
    return this._send('GET', `challenges/${challengeId}/solution`, undefined, false).catch(() => null)
  },

  runProgram(challengeId, program, staticAnalysis) {
    const solutionId = uuidv4()
    const data = {
      challengeId,
      solutionId,
      program,
      staticAnalysis,
    }
    this._send('POST', 'solutions', data, false).catch(logger('runProgram'))

    return solutionId
  },

  executionFinished(solutionId, executionResult) {
    this._send('PUT', `solutions/${solutionId}`, { executionResult }, false).catch(logger('executionFinished'))
  },

  // LOGIN - REGISTER
  async login(credentials) {
    return this._send('POST', 'login', credentials)
      .then(user => this.storage.saveUser(user))
  },

  async register(data) {
    const { username, avatarURL } = data
    const profile = {
      nickName: username,
      avatarURL
    }
    return this._send('POST', 'register', { ...data, profile })
      .then(user => this.storage.saveUser(user))
  },

  async changePassword(newCredentials) {
    return this._send('PUT', 'credentials', newCredentials)
      .then(user => this.storage.saveUser(user))
  },

  async userExists(username) {
    return this._send('GET', `users/exists?username=${username}`)
  },

  async newAnswer(data) {
    return this._send('POST', `answers`, data)
      .then(user => this.storage.saveUser(user))
  },

  logout() {
    return this.storage.saveUser(null)
  },

  getUser() { return this.storage.getUser() },


  async _send(method, resource, body, critical = true) {
    if (!this.connected) { 
      if (critical) this._alertServerError()
      return; 
    }
    const user = this.getUser()
    if (body) { body.session = this.pilasBloquesAnalytics.buildSession(user && user.nickName) }

    const url = `${baseURL}/${resource}`
    const flag = `loading.${resource.split('?')[0].replace('/', '-')}`
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': user ? `Bearer ${user.token}` : null
    }

    this.set(flag, true)
    return fetch(url, {
      method,
      body: JSON.stringify(body),
      headers
    })
      .catch(connectionErr => {
        if (critical) this._alertServerError()
        // console.log({ connectionErr })
        throw connectionErr
      })
      .then(res => {
        if (res.status >= 400) { return res.text().then(message => { throw { status: res.status, message } }) }
        else { return res.json().catch(() => { /** if not body present */}) }
      })
      .finally(() => this.set(flag, false))
  },

  _alertServerError() {
    this.paperToaster.show("Problemas con el servidor, intentar más tarde", {
      duration: 4000,
      position: "top"
    })
  },
})
