/* app/services/intl.js */
import { assign } from '@ember/polyfills';
import IntlService from 'ember-intl/services/intl';
import Ember from 'ember';
import ENV from 'pilasbloques/config/environment'


export default IntlService.extend({
  t(key, options) {
    return this.addTranslationCheck(this._super(key, assign({ htmlSafe: true }, options))).toString();
  },

  addTranslationCheck(safeHTML) {
    return ENV.testTranslations ?
      Ember.String.htmlSafe("<del>" + safeHTML.string + "</del> <ins>(translated✓)</ins>") :
      safeHTML
  }
});
