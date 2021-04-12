import { inject as service } from '@ember/service'
import { computed } from '@ember/object'
import Controller from '@ember/controller'
import { notFound } from '../utils/request'

export default Controller.extend({
  avatardb: service(),
  pilasBloquesApi: service(),
  registerData: {},
  validUsername: true,

  avatars: computed('avatardb', function () {
    return this.avatardb.allAvatars()
  }),

  actions: {
    doRegister() {
      this.pilasBloquesApi.register(this.registerData)
        .then(() => this.transitionToRoute("/"))
    },

    checkUsername() {
      this.pilasBloquesApi.passwordRecovery(this.registerData.username)
        .then(_ => this.set("validUsername", false))
        .catch(notFound(() => {
          this.set("validUsername", true)
        }))
    },
  }
})