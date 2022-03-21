import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
export default Route.extend({
  intl: service(),
  beforeModel() {
    const selectedLanguage = localStorage.getItem('selectedLanguage')
    if (selectedLanguage) this.get('intl').setLocale(selectedLanguage)
  }
});
