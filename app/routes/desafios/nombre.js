import Ember from 'ember';

export default Ember.Route.extend({
  actividades: Ember.inject.service(),
  actividadActual: null,

  model(param) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      var actividad = this.get('actividades').obtenerPorNombre(param.nombre);
      this.set('actividadActual', actividad);

      if (!actividad) {
        let msg = "ERROR: no existe un desafio con ese nombre";
        return reject(msg);
      }

      return resolve({actividad: actividad});
    });
  },

  actions: {
    reiniciar() {
      this.get('actividadActual').iniciarEscena();
    }
  }
});
