import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
export default Route.extend({
  intl: service(),
  beforeModel() {
    this.get('intl').setLocale(['es-ar']);
  },

  afterModel() {
    // Load Mulang lazy
    const _script = document.createElement('script')
    _script.type = 'text/javascript'
    _script.src = 'assets/mulang.js'
    const _head = document.getElementsByTagName("head")[0]
    _head.appendChild(_script)
  }
});
