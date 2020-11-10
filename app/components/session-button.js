import { inject as service } from '@ember/service'
import Component from '@ember/component'

export default Component.extend({
  pilasBloquesApi: service(),
  wrongLogin: false,

  didInsertElement() {
    this.updateSession()
  },

  updateSession() {
    this.set("session", this.pilasBloquesApi.getSession())
  },

  actions: {
    changeUser() {
      this.pilasBloquesApi.logout()
      this.updateSession()
      this.set("openLogin", true)
    },
    logout() {
      this.pilasBloquesApi.logout()
      document.location.reload()
    },
  },
});
