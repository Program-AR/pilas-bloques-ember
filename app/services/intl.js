/* app/services/intl.js */
import { assign } from '@ember/polyfills';
import IntlService from 'ember-intl/services/intl';

export default IntlService.extend({
  t(key, options) {
    return this._super(key, assign({ htmlSafe: true }, options));
  }
});
