import { inject as service } from '@ember/service'
import Controller from '@ember/controller'
import { badRequest, notFound } from '../utils/request'

export default Controller.extend({
  pilasBloquesApi: service(),
  queryParams: ['token'],
  token: null,
  credentials: {},
  usernameExists: true, // Default true for (no) error visualization
  wrongCredentials: false,

  actions: {
    checkUsername(cb) {
      this.pilasBloquesApi.passwordRecovery(this.credentials.username)
        .then((credentials) => {
          this.set("usernameExists", true)
          this.set("credentials", credentials)
          cb()
        })
        .catch(notFound(() => {
          this.set("usernameExists", false)
        }))
    },

    changePassword(cb) {
      this.set("wrongCredentials", false)
      this.set("credentials.token", this.token)
      this.pilasBloquesApi.changePassword(this.credentials)
        .then(cb)
        .catch(badRequest(() => {
          this.set("wrongCredentials", true)
          this.set("credentials.password", "")
        }))
    },
  }
})