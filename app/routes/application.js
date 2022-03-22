import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  storage: service(),
  intl: service(),

  beforeModel() {
    const selectedLocale = this.storage.getSelectedLocale()
    this.get('intl').setLocale(selectedLocale || 'es-ar')
  }
});
