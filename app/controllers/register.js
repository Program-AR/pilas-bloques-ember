import { inject as service } from '@ember/service'
import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  avatardb: service(),
  pilasBloquesApi: service(),
  registerData: {},
  validUsername: true,
  validEmail: true,
  validParentName: true,

  avatars: computed('avatardb', function() {
    return this.avatardb.allAvatars()
  }),

  actions: {
    doRegister() {
      this.pilasBloquesApi.register(this.registerData)
      .then(() => this.transitionToRoute("/"))
    },

    checkUsername() {
      this.pilasBloquesApi.userExists(this.registerData.username)
        .then(exist => this.set("validUsername", !exist))
    },

    checkEmail() {
      this.set("validEmail", this._isValidEmail(this.registerData.email))
    },

    checkParentName() {
      this.set("validParentName", this._isValidParentName(this.registerData.parentName))
    },
  },

  // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  _isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },

  _isValidParentName(parentName) {
    const re = /.+ .+/;
    return re.test(parentName);
  }

})