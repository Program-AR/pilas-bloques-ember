import Bloque from 'pilas-engine-bloques/actividades/bloque';
import {ParamValor} from 'pilas-engine-bloques/actividades/bloques';

var EstructuraDeControl = Bloque.extend({

  block_init(block) {
    this._super(block);
    block.setColour(Blockly.Blocks.loops.COLOUR);
    block.setInputsInline(true);
    block.setPreviousStatement(true);
    block.setNextStatement(true);
  }

});

var Repetir = EstructuraDeControl.extend({

  init() {
    this._super();
    this.set('id', 'repetir');
  },

  block_init(block) {
    this._super(block);
    block.appendValueInput('count')
        .setCheck('Number')
        .appendField('Repetir');
    block.appendStatementInput('block');
  },

  block_javascript(block) {
    var value_count = Blockly.JavaScript.valueToCode(block, 'count', Blockly.JavaScript.ORDER_ATOMIC) || '0' ;
    var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block;
    r += 'programa.repetirN(function(){\nreturn {{n}};\n});\n'.replace('{{n}}', value_count);
    return r;
  },

  get_parametros() {
    return [
      ParamValor.create({
        nombre_param: 'count',
        tipo_bloque: 'math_number',
        nombre_valor: 'NUM',
        valor: '10'
      })
    ];
  }


});

/* ============================================== */

var Si = EstructuraDeControl.extend({

  init() {
    this._super();
    this.set('id', 'si');
  },

  block_init(block) {
    this._super(block);
    block.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('Si');
    block.appendStatementInput('block');
  },

  block_javascript(block) {
    var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block;
    r += 'programa.alternativa_si(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
    return r;
  }

});

/* ============================================== */

var Sino = EstructuraDeControl.extend({

  init() {
    this._super();
    this.set('id', 'sino');
  },

  block_init(block) {
    this._super(block);
    block.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('Si');
    block.appendStatementInput('block1');
    block.appendDummyInput()
        .appendField('si no');
    block.appendStatementInput('block2');
  },

  block_javascript(block) {
    var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    var statements_block1 = Blockly.JavaScript.statementToCode(block, 'block1');
    var statements_block2 = Blockly.JavaScript.statementToCode(block, 'block2');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block1;
    r += 'programa.empezar_secuencia();\n';
    r += statements_block2;
    r += 'programa.alternativa_sino(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
    return r;
  }

});

/* ============================================== */

var Hasta = EstructuraDeControl.extend({

  init() {
    this._super();
    this.set('id', 'hasta');
  },

  block_init(block) {
    this._super(block);
    block.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('Repetir hasta que');
    block.appendStatementInput('block');
  },

  block_javascript(block) {
    var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'true';
    var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block;
    r += 'programa.repetir_hasta(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
    return r;
  }

});

export {EstructuraDeControl, Repetir, Si,  Sino, Hasta};
