import Ember from 'ember';

Blockly.Blocks.primitivas = { COLOUR: '#4a6cd4' };
Blockly.Blocks.sensores = { COLOUR: '#4a6cd4' };
Blockly.Blocks.eventos = { COLOUR: '#4a6cd4' };

/* ============================================== */

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

/* ============================================== */

// Pide implementar sólo block_javascript
// Sirve para pisar el JS que produce blockly
var CambioDeJSDeBlocky = Bloque.extend({

  registrar_en_blockly: function() {
    var myThis = this;
    Blockly.JavaScript[this.get('id')] = function(block) {
      return myThis.block_javascript(block);
    };
  }

});

/* ============================================== */

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

/* ============================================== */

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

/* ============================================== */

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

/* ============================================== */

var IrDerecha = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'ir_derecha');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('ir derecha');
  },

  nombre_comportamiento: function() {
    return 'MoverHaciaDerecha';
  },

  argumentos: function() {
    return '{cantidad: 68, tiempo: 1}';
  }

});

/* ============================================== */

var IrIzquierda = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'ir_izquierda');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('ir izquierda');
  },

  nombre_comportamiento: function() {
    return 'MoverHaciaIzquierda';
  },

  argumentos: function() {
    return '{cantidad: 68, tiempo: 1}';
  }

});

/* ============================================== */

var IrArriba = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'ir_arriba');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('arriba.png'))
         .appendField('ir arriba');
  },

  nombre_comportamiento: function() {
    return 'MoverHaciaArriba';
  },

  argumentos: function() {
    return '{cantidad: 80, tiempo: 1}';
  }

});

/* ============================================== */

var IrAbajo = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'ir_abajo');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('abajo.png'))
         .appendField('ir abajo');
  },

  nombre_comportamiento: function() {
    return 'MoverHaciaAbajo';
  },

  argumentos: function() {
    return '{cantidad: 80, tiempo: 1}';
  }

});

/* ============================================== */

var Recoger = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'recoger');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
        .appendField('recoger')
        .appendField(new Blockly.FieldImage('libs/data/tuerca.png', 16, 16, 'tuerca'));
  },

  nombre_comportamiento: function() {
    return 'Recoger';
  },

  argumentos: function() {
    return '{tiempo: 1}';
  }

});

/* ============================================== */

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

var ChocaConTuerca = Sensor.extend({
  init: function() {
    this._super();
    this.set('id', 'choca_con_tuerca');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('choca con')
         .appendField(new Blockly.FieldImage('libs/data/tuerca.png', 15, 15, 'tuerca'));
  },

  nombre_sensor: function() {
    return 'choca_con_tuerca()';
  }
});

/* ============================================== */

var EstructuraDeControl = Bloque.extend({

  block_init: function(block) {
    this._super(block);
    block.setColour(Blockly.Blocks.loops.COLOUR);
    block.setInputsInline(true);
    block.setPreviousStatement(true);
    block.setNextStatement(true);
  }

});

/* ============================================== */

var Repetir = EstructuraDeControl.extend({

  init: function() {
    this._super();
    this.set('id', 'repetir');
  },

  block_init: function(block) {
    this._super(block);
    block.appendValueInput('count')
        .setCheck('Number')
        .appendField('repetir');
    block.appendStatementInput('block');
  },

  block_javascript: function(block) {
    var value_count = Blockly.JavaScript.valueToCode(block, 'count', Blockly.JavaScript.ORDER_ATOMIC) || '0' ;
    var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block;
    r += 'programa.repetirN(function(){\nreturn {{n}};\n});\n'.replace('{{n}}', value_count);
    return r;
  },

  get_parametros: function() {
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

  init: function() {
    this._super();
    this.set('id', 'si');
  },

  block_init: function(block) {
    this._super(block);
    block.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('si');
    block.appendStatementInput('block');
  },

  block_javascript: function(block) {
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

  init: function() {
    this._super();
    this.set('id', 'sino');
  },

  block_init: function(block) {
    this._super(block);
    block.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('si');
    block.appendStatementInput('block1');
    block.appendDummyInput()
        .appendField('sino');
    block.appendStatementInput('block2');
  },

  block_javascript: function(block) {
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

  init: function() {
    this._super();
    this.set('id', 'hasta');
  },

  block_init: function(block) {
    this._super(block);
    block.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('repetir hasta que');
    block.appendStatementInput('block');
  },

  block_javascript: function(block) {
    var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'true';
    var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block;
    r += 'programa.repetir_hasta(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
    return r;
  }

});

var ExpresionDeBlockly = Bloque.extend({

  registrar_en_blockly: function() {
    // pisado porque ya viene con blockly
    // ni tampoco quiero modificar el javascript
  }

});

var Numero = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'math_number');
  },
});

var OpAritmetica = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'math_arithmetic');
  },
});

var Booleano = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'logic_boolean');
  },
});

var OpComparacion = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'logic_compare');
  },
});

var OpLogica = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'logic_operation');
  },
});

var OpNegacion = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'logic_negate');
  },
});

/* ============================================== */

/*
 * Representa el valor
 * de un campo string de un bloque
 */
/*exported ParamCampo*/
var ParamCampo = Ember.Object.extend({
   build: function() {
     var str_block = '';
     str_block += '<field name="NOMBRE">'.replace('NOMBRE', this.get('nombre_valor'));
     str_block += this.get('valor');
     str_block += '</field>';
     return str_block;
   }
});

/* ============================================== */

/*
 * Representa un valor mas complejo
 * de un campo de un bloque
 */
var ParamValor = Ember.Object.extend({
   build: function() {
     var str_block = '';
     str_block += '<value name="NOMBRE">'.replace('NOMBRE', this.get('nombre_param'));

     str_block += '<block type="TIPO">'.replace('TIPO', this.get('tipo_bloque'));

     str_block += '<field name="TIPO">'.replace('TIPO', this.get('nombre_valor'));
     str_block += this.get('valor');
     str_block += '</field>';

     str_block += '</block>';

     str_block += '</value>';

     return str_block;
   }
});

/* ============================================== */

/*
 * Representa el lenguaje que podra utilizarse
 * en una actividad
 */
var Lenguaje = Ember.Object.extend({

  init: function() {
    this.set('categorias', []);
    this.set('bloques', {});
  },

  agregar: function(c, bs) {
    if(bs !== undefined) {
      this.categoria(c);
      bs.forEach(function (b) {
        this.bloque(c, b);
      }.bind(this));
    }
  },

  categoria: function(c) {
    this.get('categorias').pushObject(c);
    var bs = this.get('bloques');
    bs[c] = [];
    this.set('bloques', bs);
  },

  bloque: function(c, b) {
    var block = this.definir_bloque(b);
    this.get('bloques')[c].pushObject(block);
  },

  definir_bloque: function(b) {
    var block = b.create();
    block.registrar_en_blockly();
    return block;
  },

  build: function() {
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

  _build_categoria: function(categoria) {
    var str_category = '';

    str_category += '<category name="x">\n'.replace('x', categoria);

    this.get('bloques')[categoria].forEach(function(b) {
       str_category += b.build();
    });

    str_category += '</category>\n';

    return str_category;
  },

  _build_procedures: function() {
    return '<category name="Subtareas" custom="PROCEDURE"></category>';
  },

  _build_variables: function() {
    return '<category name="Variables" custom="VARIABLE"></category>';
  }

});




























/* ============================================== */

/**
  Modelo de actividad
**/
var Actividad = Ember.Object.extend({
  init: function() {
    var actividad = this.get('actividad');
    this.set('nombre', actividad.nombre);
    this.set('enunciado', actividad.enunciado);
    this.set('escena', actividad.escena);
    this.set('puedeComentar', actividad.puedeComentar);
    this.set('puedeDesactivar', actividad.puedeDesactivar);
    this.set('puedeDuplicar', actividad.puedeDuplicar);
    this.setColours();
    this.pisar_bloques_blockly();
  },

  iniciarEscena: function () {
    var Esc = this.get('escena');
    var esc_instance = new Esc();
    this.set('escena_instanciada', esc_instance);
    pilas.mundo.gestor_escenas.cambiar_escena(esc_instance);
  },

  obtenerLenguaje: function() {
    var act = this.get('actividad');
    var leng = Lenguaje.create();

    leng.agregar('Acciones', act.acciones);
    leng.agregar('Sensores', act.sensores);
    leng.agregar('Control', act.control);
    leng.agregar('Expresiones', act.expresiones);
    leng.agregar('Variables', act.variables);
    leng.agregar('Subtareas', act.subtareas);

    return leng.build();
  },

  bloques_iniciales: function() {
    return [AlEmpezar];
  },

  crear_bloques_iniciales: function() {
    this.bloques_iniciales().forEach(function(b){
      b.create().instanciar_para_workspace();
    });
  },

  pisar_bloques_blockly: function() {
    CallReturn.create().registrar_en_blockly();
    CallNoReturn.create().registrar_en_blockly();
    ParamGet.create().registrar_en_blockly();
    VariableGet.create().registrar_en_blockly();
    VariableSet.create().registrar_en_blockly();
    VariableLocalGet.create().registrar_en_blockly();
    VariableLocalSet.create().registrar_en_blockly();
  },

  usa_procedimientos: function() {
    return this.get('actividad').subtareas.indexOf(Procedimiento) > -1;

  },

  usa_funciones: function() {
    return this.get('actividad').subtareas.indexOf(Funcion) > -1;
  },

  iniciarBlockly: function(contenedor) {
    var actividad = this;

    Blockly.inject(contenedor, {
      collapse: false,
      duplicate: actividad.get('puedeDuplicar'),
      trashOnlyDelete: true,
      disable: actividad.get('puedeDesactivar'),
      comments: actividad.get('puedeComentar'),
      rgbColours: true,
      defsOnly: true,
      def_procedures: actividad.usa_procedimientos(),
      def_functions: actividad.usa_funciones(),
      globalVariables: false,
      oneReturnOnly: true,
      defsNames: ['al_empezar_a_ejecutar', 'procedures_defnoreturn', 'procedures_defreturn'],
      path: './libs/blockly/',
      toolbox: Blockly.Xml.textToDom(actividad.obtenerLenguaje()),
    });

    this.crear_bloques_iniciales();
  },

  generarCodigo: function() {
    // variable global con la que se accede al receptor del programa
    window.receptor = this.get('escena_instanciada').automata;
    var comienzo = 'var programa = new pilas.comportamientos.ConstructorDePrograma();\n\n';
    var code = Blockly.JavaScript.workspaceToCode();
    return comienzo + code;
  },

  // Scratch style colours
  setColours: function() {
    Blockly.Blocks.primitivas.COLOUR = '#4a6cd4';
    Blockly.Blocks.sensores.COLOUR = '#2ca5e2';
    Blockly.Blocks.eventos.COLOUR = '#00a65a'; // == boton ejecutar
    Blockly.Blocks.math.COLOUR = '#49930e';
    Blockly.Blocks.logic.COLOUR = '#5cb712';
    Blockly.Blocks.loops.COLOUR = '#ee7d16';

    Blockly.Blocks.procedures.COLOUR = '#6C52EB';
    Blockly.Blocks.procedures.vars.COLOUR = '#8a55d7';
    Blockly.Blocks.procedures.params.COLOUR = '#6C52EB';


    Blockly.Blocks.variables.COLOUR = '#cc5b22';

    Blockly.Blocks.texts.COLOUR = '#4a6cd4';
    Blockly.Blocks.lists.COLOUR = '#cc5b22';
    Blockly.Blocks.colour.COLOUR = '#4a6cd4';

    // IN SCRATCH THE COLOURS ARE
    // 4a6cd4 MOTION
    // 8a55d7 LOOKS
    // bb42c3 SOUND
    // 0e9a6c PEN
    // ee7d16 DATA Variables
    // cc5b22 DATA Lists
    // c88330 EVENTS
    // e1a91a CONTROL
    // 2ca5e2 SENSING
    // 5cb712 OPERATORS
    // 49930e OPERATORS dark
    // 632d99 MORE BLOCKS
    // 5e4db3 PARAMS
  },

  obtener_codigo_en_texto: function() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
    return Blockly.Xml.domToText(xml);
  },

});

/* ============================================== */

var EscenaAlien = (function (_super) {
    __extends(EscenaAlien, _super);
    function EscenaAlien() {
      _super.apply(this, arguments);
    }

    EscenaAlien.prototype.coord_grilla = function(fila, columna) {
      var columnas = [-175, -105, -35, 35, 105, 175];
      var filas = [140, 60, -20, -100, -180];

      return {x: columnas[columna-1], y: filas[fila-1]};
    };

    EscenaAlien.prototype.iniciar = function() {

      new pilas.fondos.Laberinto1();
      var alien = new pilas.actores.Alien(-175, -180);

      this.automata = alien;

      // metodo para ver si choca con tuerca
      alien.choca_con_tuerca = function() {
        var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca');
        return actores.length > 0;
      };

      alien.cuando_busca_recoger = function() {
        var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca');
        if (actores.length > 0) {
          var mensaje = '';
          actores[0].eliminar();
          var restantes = pilas.obtener_actores_con_etiqueta('Tuerca').length;

          if (restantes > 0) {
            mensaje = 'genial, aún quedan: ' + restantes;
          } else {
            mensaje = '¡Nivel completado!';
          }

          // alien.decir(mensaje);
        }
      };

      var posicion = this.coord_grilla(1, 1);
      new pilas.actores.Tuerca(posicion.x, posicion.y);

      posicion = this.coord_grilla(2, 2);
      new pilas.actores.Tuerca(posicion.x, posicion.y);

      posicion = this.coord_grilla(3, 3);
      new pilas.actores.Tuerca(posicion.x, posicion.y);

      posicion = this.coord_grilla(4, 4);
      new pilas.actores.Tuerca(posicion.x, posicion.y);

      posicion = this.coord_grilla(5, 5);
      new pilas.actores.Tuerca(posicion.x, posicion.y);
    };

    return EscenaAlien;
})(Base);

/* ============================================== */

var actividadAlien = {
  nombre: 'El alien y las tuercas',
  enunciado: 'Define un programa para que el alien junte todas las tuercas',
  escena: EscenaAlien,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento, Funcion],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir, Si, Sino, Hasta],
  expresiones: [Numero, OpAritmetica, OpComparacion, Booleano, OpLogica, OpNegacion],
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, Recoger],
  sensores: [ChocaConTuerca]
};

/* ============================================== */

var Actividades = {
  Alien: Actividad.create({ actividad: actividadAlien }),
};

export default Actividades;
