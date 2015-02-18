function obtener_icono(nombre) {
  return new Blockly.FieldImage('iconos/' + nombre, 16, 16, '<');
}


Blockly.Blocks['move_to'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(160);
    this.appendDummyInput()
        .appendField('mover a la posición');
    this.appendValueInput('XPOS')
        .setCheck('Number')
        .appendField('x');
    this.appendValueInput('YPOS')
        .setCheck('Number')
        .appendField('y');
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
        .appendField('saludar');
    this.appendValueInput('MENSAJE')
        .setCheck('String')
        .appendField('mensaje');
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
        .appendField('ir a la derecha');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['alien-ir_derecha'] = function(block) {
  return 'programa.hacer(MoverHaciaDerecha, {cantidad: 68, tiempo: 1})\n';
};

/* ============================================== */

Blockly.Blocks['alien-ir_arriba'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField(obtener_icono('arriba.png'))
        .appendField('ir a la arriba');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['alien-ir_arriba'] = function(block) {
  return 'programa.hacer(MoverHaciaArriba, {cantidad: 80, tiempo: 1})\n';
};

/* ============================================== */

Blockly.Blocks['alien-ir_abajo'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField(obtener_icono('abajo.png'))
        .appendField('ir a la abajo');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['alien-ir_abajo'] = function(block) {
  return 'programa.hacer(MoverHaciaAbajo, {cantidad: 80, tiempo: 1})\n';
};

/* ============================================== */


Blockly.Blocks['alien-ir_izquierda'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField(obtener_icono('izquierda.png'))
        .appendField('ir a la izquierda');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['alien-ir_izquierda'] = function(block) {
  return 'programa.hacer(MoverHaciaIzquierda, {cantidad: 68, tiempo: 1})\n';
};

/* ============================================== */

Blockly.Blocks['alien-recoger'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('recoger');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['alien-recoger'] = function(block) {
  return 'programa.hacer(Recoger, {tiempo: 1})\n';
};

Blockly.Blocks['choca_con_tuerca'] = {
  init: function() {
    this.setColour(225);
    this.appendDummyInput()
        .appendField('choca con')
        .appendField(new Blockly.FieldImage('libs/data/tuerca.png', 15, 15, 'tuerca'));
    this.setInputsInline(true);
    this.setOutput(true);
  }
};

Blockly.JavaScript['choca_con_tuerca'] = function(block) {
  return ['receptor.colisiona_con_item("Tuerca")', Blockly.JavaScript.ORDER_ATOMIC];
};

/* ============================================== */

Blockly.Blocks['repetir'] = {
  init: function() {
    this.setColour(0);
    this.appendValueInput('count')
        .setCheck('Number')
        .appendField('repetir');
    this.appendStatementInput('block');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['repetir'] = function(block) {
  var value_count = Blockly.JavaScript.valueToCode(block, 'count', Blockly.JavaScript.ORDER_ATOMIC) || '0' ;
  var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
  var r = 'programa.empezar_secuencia();\n';
  r += statements_block;
  r += 'programa.repetirN(function(receptor){ return {{n}}; });\n'.replace('{{n}}', value_count);
  return r;
};

/* ============================================== */

Blockly.Blocks['hasta'] = {
  init: function() {
    this.setColour(0);
    this.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('repetir hasta que');
    this.appendStatementInput('block');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['hasta'] = function(block) {
  var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'true';
  var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
  var r = 'programa.empezar_secuencia();\n';
  r += statements_block + '\n';
  r += 'programa.repetir_hasta(function(receptor){ return {{condition}}; });\n'.replace('{{condition}}', value_condition);
  return r;
};

/* ============================================== */

Blockly.Blocks['si'] = {
  init: function() {
    this.setColour(0);
    this.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('si');
    this.appendStatementInput('block');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['si'] = function(block) {
  var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
  var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
  var r = 'programa.empezar_secuencia();\n';
  r += statements_block;
  r += 'programa.alternativa_si(function(receptor){ return {{condition}}; });\n'.replace('{{condition}}', value_condition);
  return r;
};


/* ============================================== */

Blockly.Blocks['sino'] = {
  init: function() {
    this.setColour(0);
    this.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('si');
    this.appendStatementInput('block1');
    this.appendDummyInput()
        .appendField('sino');
    this.appendStatementInput('block2');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['sino'] = function(block) {
  var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
  var statements_block1 = Blockly.JavaScript.statementToCode(block, 'block1');
  var statements_block2 = Blockly.JavaScript.statementToCode(block, 'block2');
  var r = 'programa.empezar_secuencia();\n';
  r += statements_block1;
  r += 'programa.empezar_secuencia();\n';
  r += statements_block2;
  r += 'programa.alternativa_sino(function(receptor){ return {{condition}}; });\n'.replace('{{condition}}', value_condition);
  return r;
};

/* ============================================== */

// PISA EL QUE OFRECE BLOCKLY
Blockly.JavaScript['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return ['receptor.' + code, Blockly.JavaScript.ORDER_ATOMIC];
};

// PISA EL QUE OFRECE BLOCKLY
Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return 'programa.cambio_atributo(' + varName + ', function(receptor){ return ' + argument0 + '; } );\n';
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
    this.setColour(130);
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
  r += 'programa.ejecutar(alien);\n';
  return r;
};
