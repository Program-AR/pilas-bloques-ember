import { inject as service } from '@ember/service'
import { computed } from '@ember/object'
import Controller from '@ember/controller'

const data = {} // Hack for use in validation

export default Controller.extend({
  pilasBloquesApi: service(),
  credentials: data,
  passwordConfirm: null,
  usernameExist: true,
  wrongCredentials: false,

  // TODO: Sacar
  checkingUsername: computed('pilasBloquesApi.loading', function () {
    return this.pilasBloquesApi.loading['register/check']
  }),

  passwordConfirmValidation: [{
    message: 'Las contraseñas no coinciden',
    validate: function (inputValue, other) {
      console.log({ inputValue, other })
      return data.password == inputValue
    }
  }],

  clearPasswords() {
    this.set("credentials.password", "")
    this.set("passwordConfirm", "")
  },

  actions: {
    checkUsername(cb) {
      this.pilasBloquesApi.validateUsername(this.credentials.username)
        .then(check => {
          this.set("usernameExist", !check)
          if (!check) cb()
        })
    },

    changePassword(cb) {
      this.set("wrongCredentials", false)
      this.pilasBloquesApi.changePassword(this.credentials)
        .then(cb)
        .catch(({ status }) => {
          if (status === 400) {
            this.set("wrongCredentials", true)
            this.clearPasswords()
          }
        })
    }
  }
})