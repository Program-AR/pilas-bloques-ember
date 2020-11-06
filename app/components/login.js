import { inject as service } from '@ember/service'
import Component from '@ember/component'

export default Component.extend({
  pilasBloquesApi: service(),
  credentials: {},
  wrongLogin: false,

  actions: {
    doLogin() {
      this.pilasBloquesApi.login(this.credentials)
        .catch(err => {
          this.set("wrongLogin", true)
          this.set("credentials.password", "")
        })
    }
  }
});
