import Ember from 'ember';

export default Ember.Component.extend({
  buscando: false,
  version: Ember.inject.service(),
  mensaje: "??",

  actions: {
    buscar() {
      this.set('buscando', true);

      this.get('version').obtener_version_del_servidor().then((resultado) => {

        setTimeout(() => {
          this.set('mensaje', "listo!");
          this.set('buscando', false);
        }, 2000);

      });

    }
  }
});
