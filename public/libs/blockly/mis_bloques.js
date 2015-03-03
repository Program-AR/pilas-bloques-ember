Blockly.Blocks.eventos = { COLOUR: '#4a6cd4' };

/* ============================================== */

// PISA EL QUE OFRECE BLOCKLY
Blockly.JavaScript['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return ['programa.receptor.' + code, Blockly.JavaScript.ORDER_ATOMIC];
};

// PISA EL QUE OFRECE BLOCKLY
Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return 'programa.cambio_atributo(' + varName + ', function(){ return ' + argument0 + '; } );\n';
};

/* ============================================== */

// PISA EL QUE OFRECE BLOCKLY
Blockly.JavaScript['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.JavaScript.valueToCode(block, 'ARG' + x,
        Blockly.JavaScript.ORDER_COMMA) || 'null';
    args[x] = 'function(){ return ' + args[x] + '; }';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// PISA EL QUE OFRECE BLOCKLY
Blockly.JavaScript['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.JavaScript.valueToCode(block, 'ARG' + x,
        Blockly.JavaScript.ORDER_COMMA) || 'null';
    args[x] = 'function(){ return ' + args[x] + '; }';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

// PISA EL QUE OFRECE BLOCKLY
Blockly.JavaScript['param_get'] = function(block) {
  // Variable getter.
  var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);

  // agrego parentesis para llamar al closure del parametro
  return [code + '()', Blockly.JavaScript.ORDER_ATOMIC];
};

/* ============================================== */

Blockly.Blocks['al_empezar_a_ejecutar'] = {
  init: function() {
    this.setColour(Blockly.Blocks.eventos.COLOUR);
    this.appendDummyInput()
        .appendField('Al empezar a ejecutar');
    this.appendStatementInput('program');
    this.setDeletable(false);
    this.setEditable(false);
    this.setMovable(false);
  }
};

Blockly.JavaScript['al_empezar_a_ejecutar'] = function(block) {
  var statements_program = Blockly.JavaScript.statementToCode(block, 'program');
  var r = 'var programa = new pilas.comportamientos.ConstructorDePrograma();\n';
  r += 'programa.empezar_secuencia();\n';
  r += statements_program + '\n';
  r += 'programa.receptor = alien;\n'; // pasar esta linea de codigo a pilasweb
  r += 'programa.ejecutar(alien);\n';
  return r;
};
