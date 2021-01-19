import Component from '@ember/component'

export default Component.extend({
  passwordConfirm: "",

  passwordConfirmValidation(password) {
    return [{
      message: 'Las contraseñas no coinciden',
      validate: function (inputValue) {
        return password == inputValue
      }
    }]
  },
})
