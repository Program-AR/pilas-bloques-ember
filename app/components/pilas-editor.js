import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['contenedor-pilas-editor'],
  persistirSolucionEnURL: true,
  ningunPanelVisible: Ember.computed.none('panelCanvasVisible', 'panelBlocklyVisible', 'panelCodigoVisible'),

  actions: {
    onReady(pilas) {
      this.sendAction("onReady", pilas);
    },
    guardar_solucion_en_el_backend(codigo_xml) {
       let hash = this.get("hash");
       let idAlumno = this.get("idAlumno");
       let actividad = this.get("model.actividad").id;

       this.sendAction("guardar_solucion_en_el_backend", {hash, idAlumno, actividad, codigo_xml});
     }
  }
});
