import { inject as service } from '@ember/service'
import Controller from '@ember/controller';

export default Controller.extend({
  pilasBloquesApi: service(),
  registerData: {},
  validUsername: true,
  wrongPasswords: false,
  avatars: ['alien.png', 'duba.png', 'lita.png'],

  validPasswords() {
    const { password, passwordConfirm } = this.registerData
    return password == passwordConfirm
  },

  actions: {
    doRegister() {
      //TODO: Validate avatar
      this.pilasBloquesApi.register(this.registerData)
      .then(() => this.transitionToRoute("/"))
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
