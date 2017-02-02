import Ember from 'ember';

export default Ember.Controller.extend({
  notificador: Ember.inject.service(),
  hayActualizacion: Ember.computed.alias('notificador.hayActualizacion'),
  versionMasReciente: Ember.computed.alias('notificador.versionActual'),

  actions: {
    visitarWeb() {
      var url = "http://bloques.pilas-engine.com.ar";
      window.open(url);
    },
  }
});
