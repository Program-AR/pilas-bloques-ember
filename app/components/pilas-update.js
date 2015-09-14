import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pilas-update'],
  buscando: false,
  version: Ember.inject.service(),
  mensaje: "",

  definirMensajeDiferido(mensaje) {
      setTimeout(() => {
        this.set('mensaje', mensaje);
        this.set('buscando', false);
      }, 2000);
  },

  actions: {
    buscar() {
      this.set('buscando', true);
      this.set('mensaje', '');

      this.get('version').obtener_estado_de_version().then((data) => {
        var comparacion = data.comparacion;
        var version_del_servidor = data.version_del_servidor;

        switch (comparacion) {
          case 0:
            this.definirMensajeDiferido("Tu versión está actualizada.");
            break;

          case -1:
            this.definirMensajeDiferido(`Tu versión es más reciente que la del servidor: ${version_del_servidor}.`);
            break;

          case 1:
            this.definirMensajeDiferido(`Existe una actualización, la versión ${version_del_servidor}.`);
            this.get('version').descargarActualizacion(version_del_servidor);
            break;
        }

      }, (error) => {

        console.error(error);
        this.definirMensajeDiferido("No se pudo consultar la versión desde Internet.");

      });

    }
  }
});
