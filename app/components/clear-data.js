import { later } from '@ember/runloop'
import { inject as service } from '@ember/service'
import Component from '@ember/component'

export default Component.extend({
  storage: service(),
  router: service(),

  didInsertElement() {
    this.storage.clear()
    later(() => this.router.transitionTo("/"), 1000)
  }

})