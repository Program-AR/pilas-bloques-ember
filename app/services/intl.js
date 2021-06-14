/* app/services/intl.js */
import { assign } from '@ember/polyfills';
import IntlService from 'ember-intl/services/intl';
import Ember from 'ember';
import ENV from 'pilasbloques/config/environment'


export default IntlService.extend({
  testTranslations: ENV.testTranslations,

  t(key, options) {
    const j = this._super(key, assign({ htmlSafe: true }, options));
    if(this.testTranslations){
      const w = "<del>"+j.string+"</del> <ins>(translated✓)</ins>"
      return Ember.String.htmlSafe(w);
    }
    else{
      return j;
    }
  }
});
