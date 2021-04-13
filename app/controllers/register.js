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
  validDNI: true,
  canRegister: computed('validUsername', 'validEmail', 'validParentName', 'validDNI', function() {
    return this.validUsername && this.validEmail && this.validParentName && this.validDNI
  }),

  avatars: computed('avatardb', function () {
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
      // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      this.set("validEmail", re.test(this.registerData.email))
    },

    checkParentName() {
      const re = /.+ .+/
      this.set("validParentName", re.test(this.registerData.parentName))
    },

    checkDNI() {
      // any string with at least 6 numbers
      const re = new RegExp('(\\D*\\d\\D*){6,}')
      this.set("validDNI", re.test(this.registerData.parentDNI))
    }
  },
})