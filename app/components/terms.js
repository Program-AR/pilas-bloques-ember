import Component from '@ember/component'
import { inject as service } from '@ember/service'
import { computed } from '@ember/object';

export default Component.extend({
  pilasBloquesApi: service(),
  storage: service(),
  router: service(),
  shouldClose: false,

  termsAreAccepted: computed('storage', 'pilasBloquesApi', function () {
    return this.get('pilasBloquesApi').getUser() || this.get('storage').termsAndConditionsAreAccepted()
  }),

  shouldOpen: computed('termsAreAccepted', 'shouldClose', function () {
    return !(this.termsAreAccepted || this.shouldClose)
  }),

  actions: {
    acceptTerms() {
      this.storage.registerTermsAndConditions()
      this.set('shouldClose', true)
    },

    rejectTerms() {
      this.router.transitionTo("/")
    }
  }
});