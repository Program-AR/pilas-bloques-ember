import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['contenedor-pilas-editor'],
  persistirSolucionEnURL: true,
  blocksGallery: Ember.inject.service(),
  cargando: true,
  showCode: true,

  didInsertElement() {
    this.get('blocksGallery').start();
  },

  actions: {
    onReady(pilas) {
      this.sendAction("onReady", pilas);
      this.set('cargando', false);
    },
    guardar_solucion_en_el_backend(codigo_xml) {
       let hash = this.get("hash");
       let idAlumno = this.get("idAlumno");
       let actividad = this.get("model.actividad").id;

       this.sendAction("guardar_solucion_en_el_backend", {hash, idAlumno, actividad, codigo_xml});
     }
  }
});
