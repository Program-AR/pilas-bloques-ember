import Ember from 'ember';
let VERSION_DEL_FORMATO_DE_ARCHIVO = 1;

export default Ember.Component.extend({
  tagName: 'span',
  cuandoSelecciona: null,
  actividad: null,
  workspace: null,
  xml: null,

  didInsertElement() {
    this.$('#cargarActividadInput').change((event) => {
      let archivo = event.target.files[0];

      if (archivo) {
        var reader = new FileReader();

        reader.onload = (e) => {
      	  let contenido = e.target.result;
          
          this.cargarSolucion(archivo, contenido);
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

  descargar(text, name, type) {
    var a = document.getElementById("placeholder");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
  },

  cargarSolucion(archivo, contenido) {
    // let regex_file = /\.spbq$/;
    // let regex_version = /^\d+$/;
    let data = null;
    let solucion = null;

    try {
      data = JSON.parse(contenido);
      solucion = atob(data.solucion);
    } catch (e) {
      console.error(e);
      alert("Lo siento, este archivo no tiene una solución de Pilas Bloques.");
      return;
    }

    if (this.get("actividad.nombre") !== data.actividad) {
      alert(`Cuidado, el archivo indica que es para otra actividad (${data.actividad}). Se cargará de todas formas, pero puede fallar.`);
    }

    this.set('workspace', solucion);
  },

  actions: {
    alPulsar() {
      this.$("#cargarActividadInput").click();
    },

    guardarSolucion() {
      let nombre_de_la_actividad = this.get("actividad.nombre");
      let nombre_surgerido = `${nombre_de_la_actividad}.spbq`;

      let contenido = {
        version: VERSION_DEL_FORMATO_DE_ARCHIVO,
        actividad: nombre_de_la_actividad,
        solucion: btoa(this.get('xml'))
      };

      let contenido_como_string = JSON.stringify(contenido);

      this.descargar(contenido_como_string, nombre_surgerido, 'application/octet-stream');
    },
  }
});
