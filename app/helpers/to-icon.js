import Ember from 'ember';

export default Ember.Helper.extend({

compute (params) {
  const text = params[0];
  return Ember.String.htmlSafe('<i class="fa fa-'+text+'"></i>');
}
});