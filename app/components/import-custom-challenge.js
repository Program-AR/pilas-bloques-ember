import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ["challenges-book-container zoom"],
  store: service(),
  router: service(),
  blocksGallery: service(),

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
      reader.onload = async (event) => await this._loadChallenge(event.target.result, resolve);
      reader.readAsArrayBuffer(archivo);
    });
  },

  async _loadChallenge(theZipContent, resolve) {
    const { entries } = await unzipit.unzip(
      new Uint8Array(theZipContent)
    );
    const arrayBuffer = await entries["desafio/desafio.json"].arrayBuffer();

    // Parseamos el JSON
    const jsonDesafioAsString = new TextDecoder().decode(arrayBuffer);
    const jsonDesafio = JSON.parse(jsonDesafioAsString);
    const splashBlob = await entries["desafio/assets/splashChallenge.png"].blob('image/png');
    jsonDesafio.challengeCover = URL.createObjectURL(splashBlob)
    const backgroundBlob = await entries["desafio/assets/background.png"].blob('image/png');
    const backgroundURL = URL.createObjectURL(backgroundBlob)
    jsonDesafio.background = backgroundURL
    jsonDesafio.escena = ` new CustomScene({grid:{spec:"${jsonDesafio.grid}"},backgroundImage:"${backgroundURL}"})` //Sobreescribe la escena previa, habria que checkear que ya no haya una escena antes
    const bloques = jsonDesafio.blocks;
    // Preparamos el objecto de la blockGallery para poder instanciar los bloques nuevos
    this.blocksGallery.start();
    bloques.forEach(block => this._createBlock(block));
    // Devolvemos el JSON como String para compatibilizar con la funcion que procesa después
    resolve(jsonDesafio);
  },

  _createBlock(aBlock) {
    const name = aBlock.name;
    const interactsWith = aBlock.interactsWith;
    const description = aBlock.description;
    const blockType = aBlock.type;

    let properties;
    if (blockType === "action") {
      properties = {
        descripcion: description,
        icono: interactsWith + '.png',
        comportamiento: 'Recolectar',
        argumentos: `{etiqueta: ${interactsWith}}`
      }
      this.blocksGallery.crearBloqueAccion(name, name, properties)
    }
    if (blockType === "sensor") {
      const object = aBlock.object;
      properties = {
        descripcion: description,
        icono: object + '.png',
        funcionSensor: `tocando("${object}")`,
        esBool: true
      }
      this.blocksGallery.crearBloqueSensor(name, name, properties)
    }
  },

  cargarProyecto(desafio) {
    /*
      Actualmente PB espera que el json tenga una key llamada "bloques" en donde el valor es un array
      con el nombre de los bloques. 

      Lo que nosotros propusimos con 'blocks' sirve para instanciar los bloques en el blockGallery, pero 
      depsués hay que hacer esta conversión para compatibilizar con el diseño actual. Ver pilas-blockly.js >> obtenerToolboxDesdeListaDeBloques

      TODO: Chequear que los bloques instanciados en la blocksGallery tienen las propiedades que definimos en el json del zip.
    */
    desafio.bloques = desafio.blocks.map(b => b.name); // Acá definimos la key que pide el PB actualmente 
    desafio.id = uuidv4();
    this.store.createRecord("desafio", desafio);
    this.router.transitionTo("desafio", desafio.id);
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
  },
});
