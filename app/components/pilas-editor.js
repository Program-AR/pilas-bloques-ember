import Ember from 'ember';

export default Ember.Component.extend({
  actividad: null,
  solucion: null,

  actions: {
    reiniciar() {
      this.get('actividad').iniciarEscena();
    },
    guardar_solucion_en_el_backend(codigo_xml) {
      let hash = this.get("hash");
      let idAlumno = this.get("idAlumno");
      let actividad = this.get('actividad').id;

      this.sendAction("guardar_solucion_en_el_backend", {hash, idAlumno, actividad, codigo_xml});
    }
  }
});
