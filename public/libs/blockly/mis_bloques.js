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
