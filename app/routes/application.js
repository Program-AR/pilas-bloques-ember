import { inject as service } from '@ember/service'
import Route from '@ember/routing/route'
import { loadLazyScript } from '../utils/request'
import { loadStaticModels } from '../utils/staticModels'

export default Route.extend({
  storage: service(),
  intl: service(),

  beforeModel() {
    const selectedLocale = this.storage.getSelectedLocale()
    this.get('intl').setLocale(selectedLocale)
    loadStaticModels(this.store)
  },
  
  afterModel() {
    loadLazyScript('mulang.js')
  },
})
