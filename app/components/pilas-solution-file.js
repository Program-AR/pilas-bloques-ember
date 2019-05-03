import Ember from 'ember'
let VERSION_DEL_FORMATO_DE_ARCHIVO = 1

export default Ember.Component.extend({
  tagName: 'span',
  cuandoSelecciona: null,
  actividad: null,
  workspace: null,
  xml: null,

  leerSolucion(archivo) {
    var reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onerror = (err) => reject(err)
      reader.onload = (event) => resolve(event.target.result)
      reader.readAsText(archivo)
    })
    .then((contenido) => this.cargarSolucion(contenido))
  },

  descargar(text, name, type) {
    var a = document.getElementById("placeholder")
    var file = new Blob([text], {type: type})
    a.href = URL.createObjectURL(file)
    a.download = name
    a.type = type
    a.click()
  },

  cargarSolucion(contenido) {
    // let regex_file = /\.spbq$/
    // let regex_version = /^\d+$/
    let data = null
    let solucion = null

    try {
      data = JSON.parse(contenido)
      solucion = atob(data.solucion)
    } catch (e) {
      console.error(e)
      throw "Lo siento, este archivo no tiene una solución de Pilas Bloques."
    }

    this.set('workspace', solucion)

    if (this.get("actividad.nombre") !== data.actividad) {
      throw `Cuidado, el archivo indica que es para otra actividad (${data.actividad}). Se cargará de todas formas, pero puede fallar.`
    }
  },

  didInsertElement() {
    this.fileInput().change((event) => {
      let archivo = event.target.files[0]

      if (archivo)
        this.leerSolucion(archivo).catch(alert)

      this.limpiarInput() // Fuerza a que se pueda cargar dos o más veces el mismo archivo
      return false
    })
  },

  fileInput() {
    return this.$("#cargarActividadInput")
  },

  limpiarInput() {
    this.fileInput().value = null
  },

  actions: {
    abrirSolucion() {
      this.fileInput().click()
    },

    guardarSolucion() {
      let activityName = this.get("actividad.nombre")
      let fileName = `${activityName}.spbq`

      let contenido = {
        version: VERSION_DEL_FORMATO_DE_ARCHIVO,
        actividad: activityName,
        solucion: btoa(this.get('xml'))
      }

      this.descargar(JSON.stringify(contenido), fileName, 'application/octet-stream')
    },
  }
})
