import { inject as service } from '@ember/service'
import Controller from '@ember/controller'
import {HttpErrorHandler, notFound} from '../utils/request'

export default Controller.extend({
  pilasBloquesApi: service(),
  queryParams: ['token'],
  token: null,
  credentials: {},
  usernameExists: true, // Default true for (no) error visualization
  wrongCredentials: false,
  isExpiredToken: false,

  actions: {
    checkUsername(cb) {
      this.pilasBloquesApi.passwordRecovery(this.credentials.username)
        .then(({ email }) => {
          this.set("usernameExists", true)
          this.set("credentials.email", email)
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
        .catch( response => {
            new HttpErrorHandler(response)
              .badRequest(() => {
                this.set("wrongCredentials", true)
                this.set("credentials.password", "")
              })
              .unauthorized(() => {
                this.set("isExpiredToken", true)
              })
          }
        )
    },
  }
})
