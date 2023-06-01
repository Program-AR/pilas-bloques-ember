import Component from '@ember/component'
import { inject as service } from '@ember/service'
import { computed } from '@ember/object';

export default Component.extend({
  storage: service(),
  shouldClose: false,

  isRead: computed('storage', function () {
    return this.storage.getOutageNoticeRead()
  }),

  shouldOpen: computed('isRead', 'shouldClose', function () {
    const shouldHide = this.isRead || this.shouldClose
    return !shouldHide
  }),

  actions: {
    doRead() {
      this.storage.setOutageNoticeRead()
      this.set('shouldClose', true)
    }
  }
});