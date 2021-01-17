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
        const { zip, entries } = await unzipit.unzip(
          new Uint8Array(event.target.result)
        );
        const arrayBuffer = await entries["desafio/desafio.json"].arrayBuffer();

        // Parseamos el JSON
        const jsonDesafioAsString = new TextDecoder().decode(arrayBuffer);
        const jsonDesafio = JSON.parse(jsonDesafioAsString);
        const bloques = jsonDesafio.blocks;
        console.log(bloques)
        // Preparamos el objecto de la blockGallery para poder instanciar los bloques nuevos
        this.blocksGallery.start();  
        
        bloques.forEach((aBlock) => {

          const name = aBlock.name;
          const interactsWith = aBlock.interactsWith;
          const description = aBlock.description;
          const blockType = aBlock.type;        

          let properties;
          if ( blockType === "action") {
            properties = {
              descripcion: description,
              icono: interactsWith+'.png',
              comportamiento: 'Recolectar',
              argumentos:`{etiqueta: ${interactsWith}}`
            }
            this.blocksGallery.crearBloqueAccion(name,properties)
          }
          if (  blockType === "sensor" ) {
            const object = aBlock.object;
            properties = {
              descripcion: description,
              icono: object+'.png',
              funcionSensor: `tocando("${object}")`,
              esBool: true
            }
            this.blocksGallery.crearBloqueSensor(name,properties)
          }
          console.log("properties", properties)
         
          
        });
        // Devolvemos el JSON como String para compatibilizar con la funcion que procesa después
        resolve(jsonDesafioAsString);
      };
      reader.readAsArrayBuffer(archivo);
    });
  },

  cargarProyecto(contenido) {
    //var desafio = JSON.parse(contenido);
    var desafio = JSON.parse(contenido);
    /*
      Actualmente PB espera que el json tenga una key llamada "bloques" en donde el valor es un array
      con el nombre de los bloques. 

      Lo que nosotros propusimos con 'blocks' sirve para instanciar los bloques en el blockGallery, pero 
      depsués hay que hacer esta conversión para compatibilizar con el diseño actual. Ver pilas-blockly.js >> obtenerToolboxDesdeListaDeBloques

      TODO: Chequear que los bloques instanciados en la blocksGallery tienen las propiedades que definimos en el json del zip.
    */
    const bloques = [];
    desafio.blocks.forEach(aBlock => {
      bloques.push(aBlock.name);
    })
    desafio.bloques= bloques; // Acá definimos la key que pide el PB actualmente 
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
