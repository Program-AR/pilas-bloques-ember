import { inject as service } from '@ember/service'
import Component from '@ember/component'

export default Component.extend({
  pilasBloquesApi: service(), 
  credentials: {},
  wrongLogin: false,

  actions: {
    doLogin() {
      console.log(this.credentials)
      this.pilasBloquesApi.login(this.credentials)
      .then(res => { 
        if (res.status >= 400) {
          this.set("wrongLogin", true)
          this.set("credentials.password", "")
        }
      })
    }
  }
});
