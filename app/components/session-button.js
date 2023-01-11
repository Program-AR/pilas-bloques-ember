import { inject as service } from '@ember/service'
import Component from '@ember/component'
import { computed } from '@ember/object';

export default Component.extend({
  pilasBloquesApi: service(),
  avatardb: service(),
  wrongLogin: false,
  session: null,

  randomAvatar: computed("avatardb", function() {
    return this.avatardb.randomAvatar()
  }),

  didInsertElement() {
    this.updateSession()
  },

  updateSession() {
    this.set("session", this.pilasBloquesApi.getUser())
  },

  actions: {
    logout() {
      this.pilasBloquesApi.logout()
      document.location.reload()
    },

    menuToggle() {
      this.set("menuOpen", !this.get('menuOpen')) 
  },
  },
});
