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
    
    /*
    const unzipit = require('unzipit');
const fsPromises = require('fs').promises;

const funcion = async function readFiles(filename) {
  const buf = await fsPromises.readFile(filename);
  const {zip, entries} = await unzipit.unzip(new Uint8Array(buf));

  const arrayBuffer = await entries['desafio/desafio.json'].arrayBuffer();

  console.log(arrayBuffer)
  console.log(String.fromCharCode.apply(null, arrayBuffer))
  const utf8Decoder = new TextDecoder();
  console.log(utf8Decoder.decode(arrayBuffer));

}*/


    var reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = (err) => reject(err);
      reader.onload = async (event) => {
        const {zip, entries} = await unzipit.unzip(new Uint8Array(event.target.result));
        const arrayBuffer = await entries['desafio/desafio.json'].arrayBuffer();
        resolve(new TextDecoder().decode(arrayBuffer));
      };
      reader.readAsArrayBuffer(archivo);
    })
  },

  cargarProyecto(contenido) {
    var desafio = JSON.parse((contenido));
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
