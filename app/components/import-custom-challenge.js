import Component from '@ember/component';
import { inject as service } from '@ember/service';

const assetsPath = 'challenge/assets'

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
      }

      this.limpiarInput(this.fileInputProyecto()); // Fuerza a que se pueda cargar dos o más veces el mismo archivo
      return false;
    });
  },

  leerSolucionWeb(archivo) {
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = (err) => reject(err);
      reader.onload = (event) => this._loadChallenge(event.target.result, resolve);
      reader.readAsArrayBuffer(archivo);
    })
      .then((contenido) => this.cargarProyecto(contenido))
      .catch(alert)
  },

  _filenameToIdentifier(filename) { //Converts "desafio/assets/obstaculos/grass.png" to "obstaculos/grass"
    return filename.replace(`${assetsPath}/`, '').split('.')[0]
  },

  _isChallengeImage(filepath) {
    return filepath.startsWith(assetsPath) && !filepath.endsWith('/') //Should be inside the assets folder and should not be a folder
  },

  async _imageContentToURL(content) {
    const blob = await content.blob('image/png') //Y si no es png?
    return URL.createObjectURL(blob)
  },

  async _getSceneImages(entries) {
    const imageEntries = Object.entries(entries).filter(entry => this._isChallengeImage(entry[0]))
    return await Promise.all(imageEntries.map(async ([filename, content]) => ({ id: this._filenameToIdentifier(filename), url: await this._imageContentToURL(content) })))
  },

  async _getChallengeJson(entries) {
    const arrayBuffer = await entries["challenge/challenge.json"].arrayBuffer();
    // Parseamos el JSON
    const jsonDesafioAsString = new TextDecoder().decode(arrayBuffer);
    return JSON.parse(jsonDesafioAsString);
  },

  //Zip and challenge.json definition: https://github.com/Program-AR/pilas-bloques/wiki/Expected-custom-challenge-zip-structure
  async _loadChallenge(theZipContent, resolve) {
    const { entries } = await unzipit.unzip(
      new Uint8Array(theZipContent)
    );
    //Para el issue eventual de ideas: Que el creador de zip checkee que el nombre no exista ya.
    const challengeJson = await this._getChallengeJson(entries)
    const sceneImages = await this._getSceneImages(entries)
    const challengeCover = await this._imageContentToURL(entries[`${assetsPath}/splashChallenge.png`]);
    challengeJson.challengeCover = challengeCover
    challengeJson.imagesToPreload = sceneImages.map(image => image.url)
    //Ahora no se pueden definir escenas en el json mismo, pero no es problema permitirlo con un "challengeJson.escena || `new CustomScene(...)" aca
    challengeJson.escena = `new CustomScene({grid:{spec:${JSON.stringify(challengeJson.grid)}}, images:${JSON.stringify(sceneImages)}})`
    // Preparamos el objecto de la blockGallery para poder instanciar los bloques nuevos
    this.blocksGallery.start(); //TODO: Esto deberia hacerse automaticamente al inyectar el servicio
    const bloques = challengeJson.blocks;
    bloques.forEach(block => this._createBlock(block));
    // Devolvemos el JSON como String para compatibilizar con la funcion que procesa después
    resolve(challengeJson);
  },

  _createBlock(aBlock) {
    const name = aBlock.name;
    const interactsWith = aBlock.interactsWith;
    const description = aBlock.description;
    const blockType = aBlock.type;

    if (blockType === "action") {
      const properties = {
        descripcion: description,
        icono: interactsWith + '.png',
        comportamiento: 'Recolectar',
        argumentos: `{etiqueta: '${interactsWith}'}`
      }
      this.blocksGallery.crearBloqueAccion(name, undefined, properties)
    }
    if (blockType === "sensor") {
      const object = aBlock.object;
      const properties = {
        descripcion: description,
        icono: object + '.png',
        funcionSensor: `tocando("${object}")`,
        esBool: true
      }
      this.blocksGallery.crearBloqueSensor(name, undefined, properties)
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
