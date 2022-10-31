import { inject as service } from '@ember/service'
import Route from '@ember/routing/route'
import { loadLazyScript } from '../utils/request'

export const DEFAULT_LOCALE = 'es-ar'

export default Route.extend({
  storage: service(),
  intl: service(),

  beforeModel() {
    const selectedLocale = this.storage.getSelectedLocale()
    this.get('intl').setLocale(selectedLocale || DEFAULT_LOCALE)
  },
  
  afterModel() {
    loadLazyScript('mulang.js')
  }
})
