import Ember from 'ember';

/*
 * Representa un bloque
 * para el lenguaje de la actividad
 */
var Bloque = Ember.Object.extend({
  init: function(){
    // espera:
    // + id
    // + categoria
  },

  block_init: function() {
    // abstracta
  },

  /*jshint unused: vars*/
  block_javascript: function(block) {
    // abstracta
  },

  registrar_en_blockly: function() {
    var myThis = this;
    Blockly.Blocks[this.get('id')] = {
      init: function() {
        myThis.block_init(this);
      }
    };

    Blockly.JavaScript[this.get('id')] = function(block) {
      return myThis.block_javascript(block);
    };
  },

  instanciar_para_workspace: function() {
    this.registrar_en_blockly();

    var block_dom = Blockly.Xml.textToDom(
      '<xml>' + this.build() + '</xml>'
    );

    Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), block_dom);
  },

  // reimplementar si se desean parametros ya aplicados
  get_parametros: function() {
    return [];
  },

  obtener_icono: function(nombre) {
    return new Blockly.FieldImage('iconos/' + nombre, 16, 16, '<');
  },

  // Escupe el código que va en el toolbox para el bloque
  build: function() {
    var str_block = '';
    str_block += '<block type="TIPO">'.replace('TIPO', this.get('id'));

    this.get_parametros().forEach(function(item) {
       str_block += item.build();
    });

    str_block += '</block>';
    return str_block;
  }
});

/*
 * Pide implementar sólo block_javascript
 * Sirve para pisar el JS que produce blockly
 */
var CambioDeJSDeBlocky = Bloque.extend({

  registrar_en_blockly: function() {
    var myThis = this;
    Blockly.JavaScript[this.get('id')] = function(block) {
      return myThis.block_javascript(block);
    };
  }
});

var VariableGet = CambioDeJSDeBlocky.extend({

  init: function() {
    this._super();
    this.set('id', 'variables_get');
  },

  block_javascript: function(block) {
    // Variable getter.
    var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    return ['receptor.atributo("' + code + '")', Blockly.JavaScript.ORDER_ATOMIC];
  }

});


var VariableSet = CambioDeJSDeBlocky.extend({

  init: function() {
    this._super();
    this.set('id', 'variables_set');
  },

  block_javascript: function(block) {
    // Variable setter.
    var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return 'programa.cambio_atributo("' + varName + '", function(){ return ' + argument0 + '; } );\n';
  }

});

/* ============================================== */

var VariableLocalGet = CambioDeJSDeBlocky.extend({

  init: function() {
    this._super();
    this.set('id', 'local_var_get');
  },

  block_javascript: function(block) {
    // Variable getter.
    var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    return ['receptor.variable("' + code + '")', Blockly.JavaScript.ORDER_ATOMIC];
  }

});

/* ============================================== */

var VariableLocalSet = CambioDeJSDeBlocky.extend({

  init: function() {
    this._super();
    this.set('id', 'local_var_set');
  },

  block_javascript: function(block) {
    // Variable setter.
    var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return 'programa.cambio_variable("' + varName + '", function(){ return ' + argument0 + '; } );\n';
  }

});

/* ============================================== */

var Procedimiento = CambioDeJSDeBlocky.extend({

  init: function() {
    this._super();
    this.set('id', 'procedures_defnoreturn');
  },

  block_javascript: function(block) {
    // Define a procedure with a return value.
    var funcName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);

    var branch = Blockly.JavaScript.statementToCode(block, 'STACK');

    if (Blockly.JavaScript.STATEMENT_PREFIX) {
      branch = Blockly.JavaScript.prefixLines(
          Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,
          '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
    }

    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
      branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
          '\'' + block.id + '\'') + branch;
    }

    var args = [];
    for (var x = 0; x < block.arguments_.length; x++) {
      args[x] = Blockly.JavaScript.variableDB_.getName(block.arguments_[x],
          Blockly.Variables.NAME_TYPE);
    }

//    var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
//        branch + returnValue + '}';

    var args_string = args.map(function(i) { return '"' + i + '"'; }).join(', ');

    var code = 'programa.empezar_secuencia();\n' +
                branch +
                'programa.def_proc("' + funcName + '", [' + args_string  + ']);\n';

    code = Blockly.JavaScript.scrub_(block, code);
    Blockly.JavaScript.definitions_[funcName] = code;
    return null;
  }

});

/* ============================================== */

var Funcion = CambioDeJSDeBlocky.extend({

  init: function() {
    this._super();
    this.set('id', 'procedures_defreturn');
  },

  registrar_en_blockly: function() {
    // pisado porque provisoriamente se
    // usa el que viene con blockly
  }

});

/* ============================================== */

var CallNoReturn = CambioDeJSDeBlocky.extend({

  init: function() {
    this._super();
    this.set('id', 'procedures_callnoreturn');
  },

  block_javascript: function(block) {
    // Call a procedure with no return value.
    var funcName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    var args = [];
    for (var x = 0; x < block.arguments_.length; x++) {
      args[x] = Blockly.JavaScript.valueToCode(block, 'ARG' + x,
          Blockly.JavaScript.ORDER_COMMA) || 'null';
      args[x] = 'function(){ return ' + args[x] + '; }';
    }
    function juntar_args() {
      if (args.length > 0) {
        return '[\n'  +  args.join(', \n')  + '\n]';
      } else {
        return '[]';
      }
    }
    // var code = funcName + '(' + args.join(', ') + ');\n';
    var code = 'programa.llamada_proc("' + funcName +
               '", ' + juntar_args() + ');\n';
    return code;
  }

});

/* ============================================== */

var CallReturn = CambioDeJSDeBlocky.extend({

  init: function() {
    this._super();
    this.set('id', 'procedures_callreturn');
  },

  block_javascript: function(block) {
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
  }

});

/* ============================================== */

var ParamGet = CambioDeJSDeBlocky.extend({

  init: function() {
    this._super();
    this.set('id', 'param_get');
  },

  block_javascript: function(block) {
    // Variable getter.
    var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);

    // agrego parentesis para llamar al closure del parametro
    return ['receptor.parametro("' + code + '")', Blockly.JavaScript.ORDER_ATOMIC];
  }

});

/* ============================================== */

var AlEmpezar = Bloque.extend({

  init: function() {
    this._super();
    this.set('id', 'al_empezar_a_ejecutar');
  },

  block_init: function(block) {
    block.setColour(Blockly.Blocks.eventos.COLOUR);
    block.appendDummyInput()
        .appendField('Al empezar a ejecutar');
    block.appendStatementInput('program');
    block.setDeletable(false);
    block.setEditable(false);
    block.setMovable(false);
  },

  block_javascript: function(block) {
    var statements_program = Blockly.JavaScript.statementToCode(block, 'program');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_program + '\n';
    r += 'programa.ejecutar(receptor);\n';
    return r;
  }

});


var Accion = Bloque.extend({

  block_init: function(block) {
    this._super(block);
    block.setColour(Blockly.Blocks.primitivas.COLOUR);
    block.setPreviousStatement(true);
    block.setNextStatement(true);
  },

  block_javascript: function(block) {
    return 'programa.hacer(' + this.nombre_comportamiento() + ', ' + this.argumentos() + ')\n';
  }

});

var Sensor = Bloque.extend({

  block_init: function(block) {
    this._super(block);
    block.setColour(Blockly.Blocks.sensores.COLOUR);
    block.setInputsInline(true);
    block.setOutput(true);
  },

  block_javascript: function(block) {
    return ['receptor.' + this.nombre_sensor() + '\n', Blockly.JavaScript.ORDER_ATOMIC];
  }
});


var bloques = {Bloque, CambioDeJSDeBlocky, VariableGet,
               VariableSet, VariableLocalGet, VariableLocalSet, Procedimiento,
               Funcion, CallNoReturn, CallReturn, ParamGet, AlEmpezar, Accion,
               Sensor};

export default bloques;
