import Ember from 'ember';


/* ============================================== */

/*
 * Representa el lenguaje que podra utilizarse
 * en una actividad
 */
var Lenguaje = Ember.Object.extend({

  init() {
    this.set('categorias', []);
    this.set('bloques', {});
  },

  agregar(c, bs) {
    if(bs !== undefined) {
      this.categoria(c);
      bs.forEach(function (b) {
        this.bloque(c, b);
      }.bind(this));
    }
  },

  categoria(c) {
    this.get('categorias').pushObject(c);
    var bs = this.get('bloques');
    bs[c] = [];
    this.set('bloques', bs);
  },

  bloque(c, b) {
    var block = this.definir_bloque(b);
    this.get('bloques')[c].pushObject(block);
  },

  definir_bloque(b) {
    var block = b.create();
    block.registrar_en_blockly();
    return block;
  },

  build() {
    var str_toolbox = '';

    str_toolbox += '<xml>';

    this.get('categorias').forEach(function(item) {
      if (item === 'Variables') {
        str_toolbox += this._build_variables();
      } else if (item === 'Subtareas') {
        str_toolbox += this._build_procedures();
      } else {
        str_toolbox += this._build_categoria(item);
      }
    }.bind(this));

    str_toolbox += '</xml>';

    return str_toolbox;
  },

  _build_categoria(categoria) {
    var str_category = '';

    str_category += '<category name="x">\n'.replace('x', categoria);

    this.get('bloques')[categoria].forEach(function(b) {
       str_category += b.build();
    });

    str_category += '</category>\n';

    return str_category;
  },

  _build_procedures() {
    return '<category name="Subtareas" custom="PROCEDURE"></category>';
  },

  _build_variables() {
    return '<category name="Variables" custom="VARIABLE"></category>';
  }

});




export default Lenguaje;
