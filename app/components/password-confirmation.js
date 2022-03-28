import Component from '@ember/component'
import { inject as service } from '@ember/service';

export default Component.extend({
  passwordConfirm: "",
  intl: service(),

  passwordConfirmValidation(password) {
    return [{
      message: this.intl.t('components.passwordConfirmation.matchError'),
      validate: function (inputValue) {
        return password == inputValue
      }
    }]
  },
})
