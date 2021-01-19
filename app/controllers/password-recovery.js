import { inject as service } from '@ember/service'
import { computed } from '@ember/object'
import Controller from '@ember/controller'

const data = {} // Hack for use in validation

export default Controller.extend({
  pilasBloquesApi: service(),
  credentials: data,
  usernameExist: true,

  checkingUsername: computed('pilasBloquesApi.loading', function() {
    return this.pilasBloquesApi.loading['register/check']
  }),

  passwordConfirmValidation: [{
    message: 'Las contraseñas no coinciden',
    validate: function(inputValue, other) {
      console.log({inputValue, other})
      return data.password == inputValue
    }
  }],

  actions: {
    checkUsername(cb) {
      this.pilasBloquesApi.validateUsername(this.credentials.username)
        .then(check => {
          this.set("usernameExist", !check)
          if (!check) cb()
        })
    },

    changePassword(cb) {
      //TODO: this.pilasBloquesApi.changePassword(this.credentials)
      Promise.reject()
      .then(cb)
      .catch(err => console.log("CUIL no coincide"))
    }
  }
})