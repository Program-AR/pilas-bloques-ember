import { inject as service } from '@ember/service'
import Route from '@ember/routing/route'
import { loadLazyScript } from '../utils/request'

export default Route.extend({
  intl: service(),
  beforeModel() {
    this.get('intl').setLocale(['es-ar'])
  },

  afterModel() {
    loadLazyScript('mulang.js')
  }
})
