import { inject as service } from '@ember/service'
import Controller from '@ember/controller';

const data = {} // Hack for use in validation

export default Controller.extend({
  pilasBloquesApi: service(),
  registerData: data,
  validUsername: true,
  avatars: ['alien.png', 'duba.png', 'lita.png'],

  passwordConfirmValidation: [{
    message: 'Las contraseñas no coinciden',
    validate: function(inputValue) {
      return data.password == inputValue
    }
  }],

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
  }
})