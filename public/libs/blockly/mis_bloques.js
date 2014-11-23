Blockly.Blocks['move_to'] = {
  // move turtle to absolute x,y location
  // for reference 0,0 is top/let and 200,200 is centre
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
  // Generate JavaScript for moving to absolute position
  var xpos = Blockly.JavaScript.valueToCode(block, 'XPOS', Blockly.JavaScript.ORDER_NONE) || '0';
  var ypos = Blockly.JavaScript.valueToCode(block, 'YPOS', Blockly.JavaScript.ORDER_NONE) || '0';
  return 'bomba.x = [' + xpos + '];\n' +  'bomba.y = [' + ypos +'];\n';
};


Blockly.Blocks['decir'] = {
  // move turtle to absolute x,y location
  // for reference 0,0 is top/let and 200,200 is centre
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
  // Generate JavaScript for moving to absolute position
  var mensaje = Blockly.JavaScript.valueToCode(block, 'MENSAJE', Blockly.JavaScript.ORDER_NONE) || '0';
  return 'bomba.decir(MENSAJE);\n'.replace('MENSAJE', mensaje);
};
