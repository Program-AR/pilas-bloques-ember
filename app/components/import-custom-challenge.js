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
      .then((contenido) => this.loadProyect(contenido))
      .catch(alert)
  },

  _filenameToIdentifier(filename) { //Converts "desafio/assets/obstaculos/grass.png" to "obstaculos/grass"
    return filename.replace(`${assetsPath}/`, '').split('.')[0]
  },

  _isChallengeImage(filepath) {
    return filepath.startsWith(assetsPath) && filepath.toLowerCase().endsWith('.png')
  },

  async _imageContentToURL(content) {
    const blob = await content.blob('image/png')
    return URL.createObjectURL(blob)
  },

  async _getSceneImages(entries) {
    const imageEntries = Object.entries(entries).filter(entry => this._isChallengeImage(entry[0]))
    return await Promise.all(imageEntries.map(async ([filename, content]) => ({ id: this._filenameToIdentifier(filename), url: await this._imageContentToURL(content) })))
  },

  async _getChallengeJson(entries) {
    const arrayBuffer = await entries["challenge/challenge.json"].arrayBuffer();
    const jsonDesafioAsString = new TextDecoder().decode(arrayBuffer);
    return JSON.parse(jsonDesafioAsString);
  },

  //Zip and challenge.json definition: https://github.com/Program-AR/pilas-bloques/wiki/Expected-custom-challenge-zip-structure
  async _loadChallenge(theZipContent, resolve) {
    const { entries } = await unzipit.unzip(
      new Uint8Array(theZipContent)
    );
    //TODO: The custom challenge creator should verify that the custom challenge name does not conflict with any pre-existing challenge name. 
    const challengeJson = await this._getChallengeJson(entries)
    const sceneImages = await this._getSceneImages(entries)
    const challengeCover = await this._imageContentToURL(entries[`${assetsPath}/splashChallenge.png`]);
    challengeJson.customCover = challengeCover
    challengeJson.imagesToPreload = sceneImages.map(image => image.url)
    //Currently it is not possible to define scenes in the json itself, like in the desafios.js file, but it can be made possible by replacing this line with "challengeJson.escena = challengeJson.sceneConstructor || `new CustomScene(...)"
    challengeJson.escena = `new CustomScene({grid:{spec:${JSON.stringify(challengeJson.grid)}}, images:${JSON.stringify(sceneImages)}})`
    this.blocksGallery.start()
    challengeJson.blocks.forEach(block => this._createBlock(block)) //Create all the custom blocks
    challengeJson.bloques = challengeJson.blocks.map(b => b.name) //The "bloques" attribute is the list with all the names of the blocks that the challenge uses   
    resolve(challengeJson)
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
      }
      this.blocksGallery.crearBloqueSensor(name, undefined, properties)
    }
  },

  loadProyect(challenge) {
    this.store.createRecord("desafio", challenge);
    this.router.transitionTo("desafio", challenge.id);
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
