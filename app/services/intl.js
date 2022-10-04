/* app/services/intl.js */
import IntlService from 'pilas-bloques-ember-intl/services/intl';
import Ember from 'ember';
import ENV from 'pilasbloques/config/environment'
import { inject as service } from '@ember/service';

export default IntlService.extend({
  storage: service(),

  t(key, options) {
    return this.addEmojiFontTag(this.addTranslationCheck(this._super(key, { ...options, htmlSafe: true })));
  },

  addTranslationCheck(safeHTML) {
    return ENV.testTranslations ?
      Ember.String.htmlSafe("<del>" + safeHTML.string + "</del> <ins>(translated✓)</ins>") :
      safeHTML
  },

  addEmojiFontTag(safeHTML){
    return Ember.String.htmlSafe(safeHTML.string.replace(
      /:[^ ]+:/g, 
      (emoji) => {
        return `<span class="emoji">${emoji}</span>`
      }
    ))
  },

  setSelectedLocale(selectedLocaleCode) {
    this.storage.saveSelectedLocale(selectedLocaleCode);
    window.location.reload(true)
  }
});
