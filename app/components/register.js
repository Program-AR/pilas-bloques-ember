import { inject as service } from '@ember/service'
import Component from '@ember/component'

export default Component.extend({
  pilasBloquesApi: service(),
  registerData: {},
  validUsername: true,
  wrongPasswords: false,

  validPasswords() {
    const { password, passwordConfirm } = this.registerData
    return password == passwordConfirm
  },

  actions: {
    doRegister() {
      this.pilasBloquesApi.register(this.registerData)
      .then(() => document.location.reload())
    },

    checkUsername() {
      this.pilasBloquesApi.validateUsername(this.registerData.username)
        .then(check => this.set("validUsername", check))
    },

    checkPassword() {
      this.set("wrongPasswords", !this.validPasswords())
    }
  }
});
