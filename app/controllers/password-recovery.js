import { inject as service } from '@ember/service'
import Controller from '@ember/controller'
import { badRequest } from '../utils/request'

export default Controller.extend({
  pilasBloquesApi: service(),
  credentials: {},
  usernameExists: true, // Default true for (no) error visualization
  wrongCredentials: false,

  actions: {
    checkUsername(cb) {
      this.pilasBloquesApi.userExists(this.credentials.username)
        .then(exist => {
          this.set("usernameExists", exist)
          if (exist) cb()
        })
    },

    changePassword(cb) {
      this.set("wrongCredentials", false)
      this.pilasBloquesApi.changePassword(this.credentials)
        .then(cb)
        .catch(badRequest(() => {
          this.set("wrongCredentials", true)
          this.set("credentials.password", "")
        }))
    },
  }
})