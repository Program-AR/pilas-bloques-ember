function obtener_icono(nombre) {
  return new Blockly.FieldImage('iconos/' + nombre, 16, 16, '<');
}


Blockly.Blocks['move_to'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(160);
    this.appendDummyInput()
        .appendField("mover a la posición");
    this.appendValueInput("XPOS")
        .setCheck("Number")
        .appendField("x");
    this.appendValueInput("YPOS")
        .setCheck("Number")
        .appendField("y");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('yeah');
  }
};

Blockly.JavaScript['move_to'] = function(block) {
  var xpos = Blockly.JavaScript.valueToCode(block, 'XPOS', Blockly.JavaScript.ORDER_NONE) || '0';
  var ypos = Blockly.JavaScript.valueToCode(block, 'YPOS', Blockly.JavaScript.ORDER_NONE) || '0';
  return 'bomba.x = [' + xpos + '];\n' +  'bomba.y = [' + ypos +'];\n';
};


/* ============================================== */


Blockly.Blocks['decir'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(160);
    this.appendDummyInput()
        .appendField("saludar")
    this.appendValueInput("MENSAJE")
        .setCheck("String")
        .appendField("mensaje");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['decir'] = function(block) {
  var mensaje = Blockly.JavaScript.valueToCode(block, 'MENSAJE', Blockly.JavaScript.ORDER_NONE) || '0';
  return 'bomba.decir(MENSAJE);\n'.replace('MENSAJE', mensaje);
};


/* ============================================== */

Blockly.Blocks['alien-ir_derecha'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField(obtener_icono('derecha.png'))
        .appendField("ir a la derecha")
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['alien-ir_derecha'] = function(block) {
  var mensaje = Blockly.JavaScript.valueToCode(block, 'MENSAJE', Blockly.JavaScript.ORDER_NONE) || '0';
  return 'alien.ir_derecha();\n';
};

/* ============================================== */

Blockly.Blocks['alien-ir_arriba'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField(obtener_icono('arriba.png'))
        .appendField("ir a la arriba")
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['alien-ir_arriba'] = function(block) {
  return 'alien.ir_arriba();\n';
};

/* ============================================== */

Blockly.Blocks['alien-ir_abajo'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField(obtener_icono('abajo.png'))
        .appendField("ir a la abajo")
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['alien-ir_abajo'] = function(block) {
  return 'alien.ir_abajo();\n';
};

/* ============================================== */


Blockly.Blocks['alien-ir_izquierda'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField(obtener_icono('izquierda.png'))
        .appendField("ir a la izquierda")
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['alien-ir_izquierda'] = function(block) {
  return 'alien.ir_izquierda();\n';
};

/* ============================================== */

Blockly.Blocks['alien-recoger'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField("recoger")
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['alien-recoger'] = function(block) {
  return 'alien.recoger();\n';
};

/* ============================================== */

Blockly.Blocks['repetir'] = {
  init: function() {
    this.setColour(0);
    this.appendValueInput("count")
        .setCheck("Number")
        .appendField("repetir");
    this.appendStatementInput("block");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['repetir'] = function(block) {
  var value_count = Blockly.JavaScript.valueToCode(block, 'count', Blockly.JavaScript.ORDER_ATOMIC) || '0' ;
  var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
  return 'for (var _ind = 0; _ind < {{n}}; _ind++) {\n {{block}}}\n'.replace('{{n}}', value_count).replace('{{block}}', statements_block);
};

/* ============================================== */

Blockly.Blocks['hasta'] = {
  init: function() {
    this.setColour(0);
    this.appendValueInput("condition")
        .setCheck("Boolean")
        .appendField("repetir hasta que");
    this.appendStatementInput("block");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['hasta'] = function(block) {
  var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'true';
  var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
  return 'while (!{{condition}}) {\n {{block}}}\n'.replace('{{condition}}', value_condition).replace('{{block}}', statements_block);
};

/* ============================================== */

Blockly.Blocks['si'] = {
  init: function() {
    this.setColour(0);
    this.appendValueInput("condition")
        .setCheck("Boolean")
        .appendField("si");
    this.appendStatementInput("block");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['si'] = function(block) {
  var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
  var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
  return 'if ({{condition}}) {\n {{block}}}\n'.replace('{{condition}}', value_condition).replace('{{block}}', statements_block);
};


/* ============================================== */

Blockly.Blocks['sino'] = {
  init: function() {
    this.setColour(0);
    this.appendValueInput("condition")
        .setCheck("Boolean")
        .appendField("si");
    this.appendStatementInput("block1");
    this.appendDummyInput()
        .appendField("sino");
    this.appendStatementInput("block2");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['sino'] = function(block) {
  var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
  var statements_block1 = Blockly.JavaScript.statementToCode(block, 'block1');
  var statements_block2 = Blockly.JavaScript.statementToCode(block, 'block2');
  return 'if ({{condition}}) {\n {{block1}}} else {\n {{block2}}}\n'.replace('{{condition}}', value_condition).replace('{{block1}}', statements_block1).replace('{{block2}}', statements_block2);
};
