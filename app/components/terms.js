import Component from '@ember/component'
import { inject as service } from '@ember/service'
import { computed } from '@ember/object';

export default Component.extend({
  pilasBloquesApi: service(),
  storage: service(),
  router: service(),
  shouldClose: false,

  termsAreAccepted: computed('storage', 'pilasBloquesApi', function () {
    return this.get('pilasBloquesApi').getUser() || this.get('storage').termsAreAccepted()
  }),

  shouldOpen: computed('termsAreAccepted', 'shouldClose', function () {
    const shouldHide = this.termsAreAccepted || this.shouldClose || !this.get('pilasBloquesApi').isConnected() 
    return !shouldHide
  }),

  actions: {
    acceptTerms() {
      this.storage.saveTermsAcceptance()
      this.set('shouldClose', true)
    },

    rejectTerms() {
      this.router.transitionTo("/")
    }
  }
});