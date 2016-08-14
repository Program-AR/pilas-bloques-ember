import Ember from 'ember';
import {Comandos,MisProcedimientos,Repeticiones,Alternativas,Separador,Variables,Sensores,Valores,Operadores,MisFunciones} from 'pilas-engine-bloques/actividades/categorias';

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

/*
Ejemplo con subcategorias:
ordenCategorias(){
  return [
    Titulo('Comandos',[
      Comandos,
      MisProcedimientos,
      Repeticiones, Alternativas,
    ]),
    Separador,
    Variables,
    Separador,
    Titulo('Expresiones',[
      Valores,
      Sensores,
      Operadores,
      MisFunciones,
    ]),
  ];
},
*/

  ordenCategorias(){
    return [
      Comandos,
      MisProcedimientos,
      Repeticiones,
      Alternativas,
      Separador,
      Variables,
      Separador,
      Valores,
      Sensores,
      Operadores,
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
