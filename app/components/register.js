import { inject as service } from '@ember/service'
import Component from '@ember/component'

export default Component.extend({
  pilasBloquesApi: service(),
  registerData: {},
  wrongPasswords: false,

  validPassword() {
    const { password, passwordConfirm } = this.registerData
    return password == passwordConfirm
  },

  actions: {
    doRegister() {
      if (!this.validPassword()) {
        this.set("wrongPasswords", true)
        return;
      }
      this.pilasBloquesApi.register(this.registerData)
    }
  }
});
