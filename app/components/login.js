import { inject as service } from '@ember/service'
import Component from '@ember/component'
import { badRequest } from '../utils/request'

export default Component.extend({
  pilasBloquesApi: service(),
  credentials: {},
  wrongLogin: false,

  actions: {
    doLogin() {
      this.set("wrongLogin", false)
      this.pilasBloquesApi.login(this.credentials)
        .then(() => document.location.reload())
        .catch(badRequest(() => {
          this.set("wrongLogin", true)
          this.set("credentials.password", "")
        }))
    }
  }
});
