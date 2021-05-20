import Component from '@ember/component';
import { inject as service } from '@ember/service';

const VERSION_DEL_FORMATO_DE_ARCHIVO = 2;

export default Component.extend({
  tagName: 'workspace-buttons',
  cuandoSelecciona: null,
  actividad: null,
  workspace: null,
  xml: null,
  store: service(),
  inElectron: typeof process !== "undefined", //TODO: Mover a un service y reemplazar a todos los lugares donde se usa.

  version() {
    return VERSION_DEL_FORMATO_DE_ARCHIVO;
  },

  leerSolucionWeb(archivo) {
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = (err) => reject(err);
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsText(archivo);
    })
      .then(contenido => this.cargarSolucion(contenido))
  },

  // Esto tengo que pasarlo a Promise nativo.
  leerSolucionFS(archivo) {
    const fs = Promise.promisifyAll(require("fs"));
    return fs.readFileAsync(archivo, 'utf-8')
      .then((contenido) => this.cargarSolucion(contenido));
  },

  cargarSolucion(contenido) {
    // let regex_file = /\.spbq$/
    // let regex_version = /^\d+$/
    let data = null;
    let solucion = null;

    try {
      data = JSON.parse(contenido);
      solucion = atob(data.solucion);
    } catch (e) {
      console.error(e);
      throw "Lo siento, este archivo no tiene una solución de Pilas Bloques.";
    }

    this.set('workspace', solucion);

    let errors = [];
    if (this.get("actividad.nombre") !== data.actividad) {
      errors.push(`Cuidado, el archivo indica que es para otra actividad (${data.actividad}). Se cargará de todas formas, pero puede fallar.`);
    }
    if (VERSION_DEL_FORMATO_DE_ARCHIVO > data.version) {
      errors.push("Cuidado, el archivo indica que es de una versión anterior. Se cargará de todas formas, pero te sugerimos que resuelvas nuevamente el ejercicio y guardes un nuevo archivo.");
    }
    if (errors.length !== 0) {
      throw errors.join('\n');
    }
  },

  openElectronLoadDialog() {
    const { dialog } = require('electron').remote
    const archivos = dialog.showOpenDialog({ //TODO: this config exists in packaging/electron.js
      properties: ['openFile'],
      filters: [
        { name: 'Solución de Pilas Bloques', extensions: ['spbq'] },
        { name: 'Todos los archivos', extensions: ['*'] }
      ]
    });
    if (archivos) {
      this.leerSolucionFS(archivos[0]).catch(alert);
    }
  },

  descargar(text, name, type) {
    var a = document.getElementById("placeholder");
    var file = new Blob([text], { type: type });
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.type = type;
    a.click();
  },

  didInsertElement() {
    this.fileInput().addEventListener("change", (event) => {
      let archivo = event.target.files[0];
      if (archivo) {
        this.leerSolucionWeb(archivo).catch(alert);
      }
      this.limpiarInput(this.fileInput());  // Fuerza a que se pueda cargar dos o más veces el mismo archivo
      return false;
    });
  },

  fileInput() {
    return this.element.querySelector("#cargarActividadInput");
  },

  limpiarInput(input) {
    input.value = null;
  },

  actions: {
    abrirSolucion() {
      if (this.inElectron) {
        this.openElectronLoadDialog();
      } else {
        this.fileInput().click();
      }
    },

    guardarSolucion() {
      let activityName = this.get("actividad.nombre");
      let fileName = `${activityName}.spbq`;

      let contenido = {
        version: VERSION_DEL_FORMATO_DE_ARCHIVO,
        actividad: activityName,
        solucion: btoa(this.xml)
      };

      this.descargar(JSON.stringify(contenido), fileName, 'application/octet-stream');
    },

    reiniciarSolucion() {
      this.set('workspace', this.actividad.solucionBaseInicial);
    },
  },

});
