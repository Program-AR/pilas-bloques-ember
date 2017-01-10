import Ember from 'ember';
import environment from '../config/environment';

export default Ember.Component.extend({
  servicioNotificador: null,
  hayActualizacion: false,
  tagName: '',
  linkDescarga: environment.linkDeDescarga,

  didInsertElement() {
    const inElectron = (typeof process !== "undefined");

    if (this.get('servicioNotificador')) {
      if (inElectron) {
        /* Solo si está en la versión offline, sobre elecrton, espera 5 segundos
         * y consulta si existe una versión nueva para descargar. */
        Ember.run.later(this, function() {
          this.consultarSiExisteVersionNueva();
        }, 5000);
      }
    }
  },


  consultarSiExisteVersionNueva() {
    this.get('servicioNotificador').consultar().then((data) => {

      if (data.hayActualizacion) {
        this.set('hayActualizacion', true);
        this.set('versionMasReciente', data.version);
        console.log(`Hay una actualización disponible. La versión ${data.version}.`);
      } else {
        console.log(`Se consultó buscando una nueva versión, pero el servidor informó la versión ${data.version} así que no hace falta actualizar...`);
      }
    }, (error) => {
      console.warn("Se quiso consultar una nueva versión pero falló el request", error);
    });
  },

  actions: {
    cerrar() {
      this.set('hayActualizacion', false);
    }
  }
});
