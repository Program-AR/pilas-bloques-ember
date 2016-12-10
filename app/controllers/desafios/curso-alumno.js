import Ember from 'ember';

export default Ember.Controller.extend({
  pilas: Ember.inject.service(),
  queryParams: ['codigo'],
  codigo: null,
  codigoJavascript: '',
});
