import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  storage: service(),
  intl: service(),

  beforeModel() {
    const selectedLanguage = this.storage.getSelectedLanguage()
    this.get('intl').setLocale(selectedLanguage || 'es-ar')
  }
});
