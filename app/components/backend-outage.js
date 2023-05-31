import Component from '@ember/component'
import { inject as service } from '@ember/service'
import { computed } from '@ember/object';

export default Component.extend({
  pilasBloquesApi: service(),
  storage: service(),
  shouldClose: false,

  isRead: computed('storage', function () {
    return this.storage.getOutageNoticeRead()
  }),

  shouldOpen: computed('isRead', 'shouldClose', 'pilasBloquesApi.connected', function () {
    const shouldHide = this.isRead || this.shouldClose || this.pilasBloquesApi.connected 
    return !shouldHide
  }),

  actions: {
    doRead() {
      this.storage.setOutageNoticeRead()
      this.set('shouldClose', true)
    }
  }
});