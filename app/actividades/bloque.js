import Ember from 'ember';

Blockly.Blocks.primitivas = { COLOUR: '#4a6cd4' };
Blockly.Blocks.sensores = { COLOUR: '#4a6cd4' };
Blockly.Blocks.eventos = { COLOUR: '#4a6cd4' };

/*
 * Representa un bloque
 * para el lenguaje de la actividad
 */
var Bloque = Ember.Object.extend({
  init() {
    // espera:
    // + id
    // + categoria
  },

  block_init() {
    // abstracta
  },

  /*jshint unused: vars*/
  block_javascript(block) {
    // abstracta
  },

  registrar_en_blockly() {
    var myThis = this;
    Blockly.Blocks[this.get('id')] = {
      init() {
        myThis.block_init(this);
      }
    };

    Blockly.JavaScript[this.get('id')] = function(block) {
      return myThis.block_javascript(block);
    };
  },

  instanciar_para_workspace() {
    this.registrar_en_blockly();

    var block_dom = Blockly.Xml.textToDom(
      '<xml>' + this.build() + '</xml>'
    );

    Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), block_dom);
  },

  // reimplementar si se desean parametros ya aplicados
  get_parametros() {
    return [];
  },

  obtener_icono(nombre) {
    return new Blockly.FieldImage('iconos/' + nombre, 16, 16, '<');
  },

  // Escupe el código que va en el toolbox para el bloque
  build() {
    var str_block = '';
    str_block += '<block type="TIPO">'.replace('TIPO', this.get('id'));

    this.get_parametros().forEach(function(item) {
       str_block += item.build();
    });

    str_block += '</block>';
    return str_block;
  }
});

export default Bloque;
