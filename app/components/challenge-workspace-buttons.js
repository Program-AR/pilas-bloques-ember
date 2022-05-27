import Component from '@ember/component';
import { inject as service } from '@ember/service';

const VERSION_DEL_FORMATO_DE_ARCHIVO = 2;

export default Component.extend({
  tagName: 'workspace-buttons',
  cuandoSelecciona: null,
  actividad: null,
  xml: null,
  store: service(),
  deleteDialogIsOpen: false,
  platform: service(),
  intl: service(),

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
      throw this.intl.t('components.challengeWorkspaceButtons.notASolution');
    }

    this.setWorkspace(solucion)

    let errors = [];
    if (this.get("actividad.nombre") !== data.actividad) {
      errors.push(this.intl.t('components.challengeWorkspaceButtons.wrongActivity', { activity: data.actividad }));
    }
    if (VERSION_DEL_FORMATO_DE_ARCHIVO > data.version) {
      errors.push(this.intl.t('components.challengeWorkspaceButtons.oldVersion'));
    }
    if (errors.length !== 0) {
      throw errors.join('\n');
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
      this.fileInput().click();
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

    borrarSolucion() {
      this.setWorkspace(this.get('actividad').initialWorkspace)
      this.set('deleteDialogIsOpen', false)
    },
  },

});
