import Ember from 'ember';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Ember.Helper.extend({
i18n: Ember.inject.service('i18n'),

compute (params) {
  const i18n = this.get('i18n');
  const target = hrefTo(this, params[1]);
  const text = i18n.t(params[0]);

  return Ember.String.htmlSafe('<a href='+ target +'><strong>' + text +'</strong></a>');
}
});
