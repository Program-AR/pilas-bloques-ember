import Ember from 'ember';

export default Ember.Controller.extend({
  notificador: Ember.inject.service(),
  hayActualizacion: Ember.computed.alias('notificador.hayActualizacion'),
  versionMasReciente: Ember.computed.alias('notificador.versionActual'),
});
