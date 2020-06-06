import Ember from 'ember';
import Component from '@ember/component';
import ENV from 'pilasbloques/config/environment'

export default Component.extend({
  tagName: 'div',
  classNames: [],
  mostrarDialogoAyuda: false,
  store: Ember.inject.service(),
  router: Ember.inject.service(),
  importarProyectoHabilitado: ENV.importarProyectoHabilitado,

  didInsertElement() {
    this.fileInputProyecto().change((event) => {
      let archivo = event.target.files[0];

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

  lowBudgetUuidv4() {//TODO should include uuid dependency
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },


  cargarProyecto(contenido){
    var desafio = JSON.parse(atob(contenido));
    desafio.id = this.lowBudgetUuidv4();
    this.store.createRecord('desafio', desafio);
    this.router.transitionTo('desafio', desafio.id);
  },

  fileInputProyecto() {
    return this.$("#cargarProyectoInput");
  },

  limpiarInput(input) {
    input.value = null;
  },

  actions: {
    abrirAyuda() {
      this.set('mostrarDialogoAyuda', true);
    },
    importarProyecto(){
      this.fileInputProyecto().click();
    },
  }
});
