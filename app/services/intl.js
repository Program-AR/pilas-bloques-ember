/* app/services/intl.js */
import IntlService from 'pilas-bloques-ember-intl/services/intl';
import ENV from 'pilasbloques/config/environment'
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';


export default IntlService.extend({
  storage: service(),

  t(key, options) {
    return this.addEmojiFontTag(this.addTranslationCheck(this._super(key, { ...options, htmlSafe: true })));
  },

  addTranslationCheck(safeHTML) {
    return ENV.testTranslations ?
      htmlSafe("<del>" + safeHTML.string + "</del> <ins>(translated✓)</ins>") :
      safeHTML
  },

  addEmojiFontTag(safeHTML){
    return htmlSafe(safeHTML.string.replace(
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
