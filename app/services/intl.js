/* app/services/intl.js */
import { assign } from '@ember/polyfills';
import IntlService from 'pilas-bloques-ember-intl/services/intl';
import Ember from 'ember';
import ENV from 'pilasbloques/config/environment'
import { inject as service } from '@ember/service';

export default IntlService.extend({
  storage: service(),

  t(key, options) {
    return this.addTranslationCheck(this._super(key, assign({ htmlSafe: true }, options)));
  },

  addTranslationCheck(safeHTML) {
    return ENV.testTranslations ?
      Ember.String.htmlSafe("<del>" + safeHTML.string + "</del> <ins>(translated✓)</ins>") :
      safeHTML
  },

  setLocale(selectedLocaleCode) {
    this.storage.saveSelectedLocale(selectedLocaleCode);
    window.location.reload(true)
  }
});
