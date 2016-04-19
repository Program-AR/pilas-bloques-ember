import Ember from 'ember';
import {Comandos,MisProcedimientos,Control,Separador,Variables,Sensores,Expresiones,MisFunciones} from 'pilas-engine-bloques/actividades/categorias';

/* ============================================== */

/*
 * Representa el lenguaje que podra utilizarse
 * en una actividad
 */
var Lenguaje = Ember.Object.extend({

  init() {
    this.set('bloques', []);
  },

  agregarBloque(claseBloque) {
    this.get('bloques').pushObject(this.definir_bloque(claseBloque));
  },

  definir_bloque(claseBloque) {
    var block = claseBloque.create();
    block.registrar_en_blockly();
    return block;
  },

  ordenCategorias(){
    return [
      Comandos,
      MisProcedimientos,
      Control,
      Separador,
      Variables,
      Separador,
      Sensores,
      Expresiones,
      MisFunciones,
    ];
  },

  build() {
    var str_toolbox = '<xml>';
    this.ordenCategorias().forEach(categoria => str_toolbox += this.xmlCategoria(categoria));
    return str_toolbox + '</xml>';
  },

  xmlCategoria(categoria) {
    return categoria.generarXML(this.get('bloques'));
  }
});




export default Lenguaje;
