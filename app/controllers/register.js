import { inject as service } from '@ember/service'
import { computed } from '@ember/object';
import Controller from '@ember/controller';

const data = {} // Hack for use in validation

export default Controller.extend({
  avatardb: service(),
  pilasBloquesApi: service(),
  registerData: data,
  validUsername: true,

  avatars: computed('avatardb', function() {
    return this.avatardb.allAvatars()
  }),

  passwordConfirmValidation: [{
    message: 'Las contraseñas no coinciden',
    validate: function(inputValue) {
      return data.password == inputValue
    }
  }],

  actions: {
    doRegister() {
      this.pilasBloquesApi.register(this.registerData)
      .then(() => this.transitionToRoute("/"))
    },

    checkUsername() {
      this.pilasBloquesApi.validateUsername(this.registerData.username)
        .then(check => this.set("validUsername", check))
    },
  }
})