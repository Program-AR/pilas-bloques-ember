import { inject as service } from '@ember/service'
import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  avatardb: service(),
  pilasBloquesApi: service(),
  registerData: {},
  validUsername: true,
  validDNI: true,

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

    checkDNI() {
      // any string with at least 6 numbers
      const re = new RegExp('(\\D*\\d\\D*){6,}')
      this.set("validDNI", re.test(this.registerData.parentDNI))
    },
  }
})