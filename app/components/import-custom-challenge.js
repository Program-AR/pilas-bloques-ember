import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['challenges-book-container zoom'],
  store: service(),
  router: service(),

  didInsertElement() {
    this.fileInputProyecto().addEventListener("change", (event) => {
      const archivo = event.target.files[0];

      if (archivo) {
        this.leerSolucionWeb(archivo)
          .then((contenido) => this.cargarProyecto(contenido))
          .catch(alert);
      }

      this.limpiarInput(this.fileInputProyecto()); // Fuerza a que se pueda cargar dos o más veces el mismo archivo
      return false;
    });
  },

  leerSolucionWeb(archivo) {
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = (err) => reject(err);
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsText(archivo);
    })
  },

  cargarProyecto(contenido) {
    var desafio = JSON.parse(atob(contenido));
    desafio.id = uuidv4();
    this.store.createRecord('desafio', desafio);
    this.router.transitionTo('desafio', desafio.id);
  },

  fileInputProyecto() {
    return document.getElementById("cargarProyectoInput");
  },

  limpiarInput(input) {
    input.value = null;
  },

  actions: {
    importarProyecto() {
      this.fileInputProyecto().click();
    },
  }

});
