import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  cuandoSelecciona: null,

  didInsertElement() {
    this.$('#cargarActividadInput').change((event) => {
      let archivo = event.target.files[0];

      if (archivo) {
        var reader = new FileReader();

        reader.onload = (e) => {
      	  let contenido = e.target.result;
          
          this.sendAction('cuandoSelecciona', archivo, contenido);
        };

        reader.readAsText(archivo);
      }

      // Fuerza a que se pueda cargar dos o más veces el mismo archivo.
      this.limpiarInput();
      return false;
    });
  },

  limpiarInput() {
    document.getElementById('cargarActividadInput').value = null;
  },

  actions: {
    alPulsar() {
      this.$("#cargarActividadInput").click();
    }
  }
});
