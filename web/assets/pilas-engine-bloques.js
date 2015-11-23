/* jshint ignore:start */

/* jshint ignore:end */

define('pilas-engine-bloques/actividades', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  Blockly.Blocks.primitivas = { COLOUR: "#4a6cd4" };
  Blockly.Blocks.sensores = { COLOUR: "#4a6cd4" };
  Blockly.Blocks.eventos = { COLOUR: "#4a6cd4" };

  /* ============================================== */

  /*
   * Representa un bloque
   * para el lenguaje de la actividad
   */
  var Bloque = Ember['default'].Object.extend({
    init: function init() {},

    block_init: function block_init() {},

    /*jshint unused: vars*/
    block_javascript: function block_javascript(block) {},

    registrar_en_blockly: function registrar_en_blockly() {
      var myThis = this;
      Blockly.Blocks[this.get("id")] = {
        init: function init() {
          myThis.block_init(this);
        }
      };

      Blockly.JavaScript[this.get("id")] = function (block) {
        return myThis.block_javascript(block);
      };
    },

    instanciar_para_workspace: function instanciar_para_workspace() {
      this.registrar_en_blockly();

      var block_dom = Blockly.Xml.textToDom("<xml>" + this.build() + "</xml>");

      Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), block_dom);
    },

    // reimplementar si se desean parametros ya aplicados
    get_parametros: function get_parametros() {
      return [];
    },

    obtener_icono: function obtener_icono(nombre) {
      return new Blockly.FieldImage("iconos/" + nombre, 16, 16, "<");
    },

    // Escupe el código que va en el toolbox para el bloque
    build: function build() {
      var str_block = "";
      str_block += "<block type=\"TIPO\">".replace("TIPO", this.get("id"));

      this.get_parametros().forEach(function (item) {
        str_block += item.build();
      });

      str_block += "</block>";
      return str_block;
    }
  });

  /* ============================================== */

  // Pide implementar sólo block_javascript
  // Sirve para pisar el JS que produce blockly
  var CambioDeJSDeBlocky = Bloque.extend({

    registrar_en_blockly: function registrar_en_blockly() {
      var myThis = this;
      Blockly.JavaScript[this.get("id")] = function (block) {
        return myThis.block_javascript(block);
      };
    }

  });

  /* ============================================== */

  var VariableGet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "variables_get");
    },

    block_javascript: function block_javascript(block) {
      // Variable getter.
      var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE);
      return ["receptor.atributo(\"" + code + "\")", Blockly.JavaScript.ORDER_ATOMIC];
    }

  });

  /* ============================================== */

  var VariableSet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "variables_set");
    },

    block_javascript: function block_javascript(block) {
      // Variable setter.
      var argument0 = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ASSIGNMENT) || "0";
      var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE);
      return "programa.cambio_atributo(\"" + varName + "\", function(){ return " + argument0 + "; } );\n";
    }

  });

  /* ============================================== */

  var VariableLocalGet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "local_var_get");
    },

    block_javascript: function block_javascript(block) {
      // Variable getter.
      var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE);
      return ["receptor.variable(\"" + code + "\")", Blockly.JavaScript.ORDER_ATOMIC];
    }

  });

  /* ============================================== */

  var VariableLocalSet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "local_var_set");
    },

    block_javascript: function block_javascript(block) {
      // Variable setter.
      var argument0 = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ASSIGNMENT) || "0";
      var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE);
      return "programa.cambio_variable(\"" + varName + "\", function(){ return " + argument0 + "; } );\n";
    }

  });

  /* ============================================== */

  var Procedimiento = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "procedures_defnoreturn");
    },

    block_javascript: function block_javascript(block) {
      // Define a procedure with a return value.
      var funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("NAME"), Blockly.Procedures.NAME_TYPE);

      var branch = Blockly.JavaScript.statementToCode(block, "STACK");

      if (Blockly.JavaScript.STATEMENT_PREFIX) {
        branch = Blockly.JavaScript.prefixLines(Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g, "'" + block.id + "'"), Blockly.JavaScript.INDENT) + branch;
      }

      if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
        branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + block.id + "'") + branch;
      }

      var args = [];
      for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.variableDB_.getName(block.arguments_[x], Blockly.Variables.NAME_TYPE);
      }

      //    var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      //        branch + returnValue + '}';

      var args_string = args.map(function (i) {
        return "\"" + i + "\"";
      }).join(", ");

      var code = "programa.empezar_secuencia();\n" + branch + "programa.def_proc(\"" + funcName + "\", [" + args_string + "]);\n";

      code = Blockly.JavaScript.scrub_(block, code);
      Blockly.JavaScript.definitions_[funcName] = code;
      return null;
    }

  });

  /* ============================================== */

  var Funcion = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "procedures_defreturn");
    },

    registrar_en_blockly: function registrar_en_blockly() {}

  });

  /* ============================================== */

  var CallNoReturn = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "procedures_callnoreturn");
    },

    block_javascript: function block_javascript(block) {
      // Call a procedure with no return value.
      var funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("NAME"), Blockly.Procedures.NAME_TYPE);
      var args = [];
      for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.valueToCode(block, "ARG" + x, Blockly.JavaScript.ORDER_COMMA) || "null";
        args[x] = "function(){ return " + args[x] + "; }";
      }
      function juntar_args() {
        if (args.length > 0) {
          return "[\n" + args.join(", \n") + "\n]";
        } else {
          return "[]";
        }
      }
      // var code = funcName + '(' + args.join(', ') + ');\n';
      var code = "programa.llamada_proc(\"" + funcName + "\", " + juntar_args() + ");\n";
      return code;
    }

  });

  /* ============================================== */

  var CallReturn = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "procedures_callreturn");
    },

    block_javascript: function block_javascript(block) {
      // Call a procedure with a return value.
      var funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("NAME"), Blockly.Procedures.NAME_TYPE);
      var args = [];
      for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.valueToCode(block, "ARG" + x, Blockly.JavaScript.ORDER_COMMA) || "null";
        args[x] = "function(){ return " + args[x] + "; }";
      }
      var code = funcName + "(" + args.join(", ") + ")";
      return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    }

  });

  /* ============================================== */

  var ParamGet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "param_get");
    },

    block_javascript: function block_javascript(block) {
      // Variable getter.
      var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE);

      // agrego parentesis para llamar al closure del parametro
      return ["receptor.parametro(\"" + code + "\")", Blockly.JavaScript.ORDER_ATOMIC];
    }

  });

  /* ============================================== */

  var AlEmpezar = Bloque.extend({

    init: function init() {
      this._super();
      this.set("id", "al_empezar_a_ejecutar");
    },

    block_init: function block_init(block) {
      block.setColour(Blockly.Blocks.eventos.COLOUR);
      block.appendDummyInput().appendField("Al empezar a ejecutar");
      block.appendStatementInput("program");
      block.setDeletable(false);
      block.setEditable(false);
      block.setMovable(false);
    },

    block_javascript: function block_javascript(block) {
      var statements_program = Blockly.JavaScript.statementToCode(block, "program");
      var r = "programa.empezar_secuencia();\n";
      r += statements_program + "\n";
      r += "programa.ejecutar(receptor);\n";
      return r;
    }

  });

  /* ============================================== */

  var Accion = Bloque.extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.primitivas.COLOUR);
      block.setPreviousStatement(true);
      block.setNextStatement(true);
    },

    block_javascript: function block_javascript(block) {
      return "programa.hacer(" + this.nombre_comportamiento() + ", " + this.argumentos() + ")\n";
    }

  });

  /* ============================================== */

  var IrDerecha = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "ir_derecha");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("derecha.png")).appendField("ir derecha");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "MoverHaciaDerecha";
    },

    argumentos: function argumentos() {
      return "{cantidad: 68, tiempo: 1}";
    }

  });

  /* ============================================== */

  var IrIzquierda = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "ir_izquierda");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("izquierda.png")).appendField("ir izquierda");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "MoverHaciaIzquierda";
    },

    argumentos: function argumentos() {
      return "{cantidad: 68, tiempo: 1}";
    }

  });

  /* ============================================== */

  var IrArriba = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "ir_arriba");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("arriba.png")).appendField("ir arriba");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "MoverHaciaArriba";
    },

    argumentos: function argumentos() {
      return "{cantidad: 80, tiempo: 1}";
    }

  });

  /* ============================================== */

  var IrAbajo = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "ir_abajo");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("abajo.png")).appendField("ir abajo");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "MoverHaciaAbajo";
    },

    argumentos: function argumentos() {
      return "{cantidad: 80, tiempo: 1}";
    }

  });

  /* ============================================== */

  var Recoger = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "recoger");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField("recoger").appendField(new Blockly.FieldImage("libs/data/tuerca.png", 16, 16, "tuerca"));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "Recoger";
    },

    argumentos: function argumentos() {
      return "{tiempo: 1}";
    }

  });

  /* ============================================== */

  var Sensor = Bloque.extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.sensores.COLOUR);
      block.setInputsInline(true);
      block.setOutput(true);
    },

    block_javascript: function block_javascript(block) {
      return ["receptor." + this.nombre_sensor() + "\n", Blockly.JavaScript.ORDER_ATOMIC];
    }
  });

  var ChocaConTuerca = Sensor.extend({
    init: function init() {
      this._super();
      this.set("id", "choca_con_tuerca");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField("choca con").appendField(new Blockly.FieldImage("libs/data/tuerca.png", 15, 15, "tuerca"));
    },

    nombre_sensor: function nombre_sensor() {
      return "choca_con_tuerca()";
    }
  });

  /* ============================================== */

  var EstructuraDeControl = Bloque.extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.loops.COLOUR);
      block.setInputsInline(true);
      block.setPreviousStatement(true);
      block.setNextStatement(true);
    }

  });

  /* ============================================== */

  var Repetir = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set("id", "repetir");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput("count").setCheck("Number").appendField("repetir");
      block.appendStatementInput("block");
    },

    block_javascript: function block_javascript(block) {
      var value_count = Blockly.JavaScript.valueToCode(block, "count", Blockly.JavaScript.ORDER_ATOMIC) || "0";
      var statements_block = Blockly.JavaScript.statementToCode(block, "block");
      var r = "programa.empezar_secuencia();\n";
      r += statements_block;
      r += "programa.repetirN(function(){\nreturn {{n}};\n});\n".replace("{{n}}", value_count);
      return r;
    },

    get_parametros: function get_parametros() {
      return [ParamValor.create({
        nombre_param: "count",
        tipo_bloque: "math_number",
        nombre_valor: "NUM",
        valor: "10"
      })];
    }

  });

  /* ============================================== */

  var Si = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set("id", "si");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput("condition").setCheck("Boolean").appendField("si");
      block.appendStatementInput("block");
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, "condition", Blockly.JavaScript.ORDER_ATOMIC) || "false";
      var statements_block = Blockly.JavaScript.statementToCode(block, "block");
      var r = "programa.empezar_secuencia();\n";
      r += statements_block;
      r += "programa.alternativa_si(function(){\nreturn {{condition}};\n});\n".replace("{{condition}}", value_condition);
      return r;
    }

  });

  /* ============================================== */

  var Sino = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set("id", "sino");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput("condition").setCheck("Boolean").appendField("si");
      block.appendStatementInput("block1");
      block.appendDummyInput().appendField("sino");
      block.appendStatementInput("block2");
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, "condition", Blockly.JavaScript.ORDER_ATOMIC) || "false";
      var statements_block1 = Blockly.JavaScript.statementToCode(block, "block1");
      var statements_block2 = Blockly.JavaScript.statementToCode(block, "block2");
      var r = "programa.empezar_secuencia();\n";
      r += statements_block1;
      r += "programa.empezar_secuencia();\n";
      r += statements_block2;
      r += "programa.alternativa_sino(function(){\nreturn {{condition}};\n});\n".replace("{{condition}}", value_condition);
      return r;
    }

  });

  /* ============================================== */

  var Hasta = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set("id", "hasta");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput("condition").setCheck("Boolean").appendField("repetir hasta que");
      block.appendStatementInput("block");
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, "condition", Blockly.JavaScript.ORDER_ATOMIC) || "true";
      var statements_block = Blockly.JavaScript.statementToCode(block, "block");
      var r = "programa.empezar_secuencia();\n";
      r += statements_block;
      r += "programa.repetir_hasta(function(){\nreturn {{condition}};\n});\n".replace("{{condition}}", value_condition);
      return r;
    }

  });

  var ExpresionDeBlockly = Bloque.extend({

    registrar_en_blockly: function registrar_en_blockly() {}

  });

  var Numero = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "math_number");
    } });

  var OpAritmetica = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "math_arithmetic");
    } });

  var Booleano = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "logic_boolean");
    } });

  var OpComparacion = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "logic_compare");
    } });

  var OpLogica = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "logic_operation");
    } });

  var OpNegacion = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "logic_negate");
    } });

  /* ============================================== */

  /*
   * Representa el valor
   * de un campo string de un bloque
   */
  /*exported ParamCampo*/
  var ParamCampo = Ember['default'].Object.extend({
    build: function build() {
      var str_block = "";
      str_block += "<field name=\"NOMBRE\">".replace("NOMBRE", this.get("nombre_valor"));
      str_block += this.get("valor");
      str_block += "</field>";
      return str_block;
    }
  });

  /* ============================================== */

  /*
   * Representa un valor mas complejo
   * de un campo de un bloque
   */
  var ParamValor = Ember['default'].Object.extend({
    build: function build() {
      var str_block = "";
      str_block += "<value name=\"NOMBRE\">".replace("NOMBRE", this.get("nombre_param"));

      str_block += "<block type=\"TIPO\">".replace("TIPO", this.get("tipo_bloque"));

      str_block += "<field name=\"TIPO\">".replace("TIPO", this.get("nombre_valor"));
      str_block += this.get("valor");
      str_block += "</field>";

      str_block += "</block>";

      str_block += "</value>";

      return str_block;
    }
  });

  /* ============================================== */

  /*
   * Representa el lenguaje que podra utilizarse
   * en una actividad
   */
  var Lenguaje = Ember['default'].Object.extend({

    init: function init() {
      this.set("categorias", []);
      this.set("bloques", {});
    },

    agregar: function agregar(c, bs) {
      if (bs !== undefined) {
        this.categoria(c);
        bs.forEach((function (b) {
          this.bloque(c, b);
        }).bind(this));
      }
    },

    categoria: function categoria(c) {
      this.get("categorias").pushObject(c);
      var bs = this.get("bloques");
      bs[c] = [];
      this.set("bloques", bs);
    },

    bloque: function bloque(c, b) {
      var block = this.definir_bloque(b);
      this.get("bloques")[c].pushObject(block);
    },

    definir_bloque: function definir_bloque(b) {
      var block = b.create();
      block.registrar_en_blockly();
      return block;
    },

    build: function build() {
      var str_toolbox = "";

      str_toolbox += "<xml>";

      this.get("categorias").forEach((function (item) {
        if (item === "Variables") {
          str_toolbox += this._build_variables();
        } else if (item === "Subtareas") {
          str_toolbox += this._build_procedures();
        } else {
          str_toolbox += this._build_categoria(item);
        }
      }).bind(this));

      str_toolbox += "</xml>";

      return str_toolbox;
    },

    _build_categoria: function _build_categoria(categoria) {
      var str_category = "";

      str_category += "<category name=\"x\">\n".replace("x", categoria);

      this.get("bloques")[categoria].forEach(function (b) {
        str_category += b.build();
      });

      str_category += "</category>\n";

      return str_category;
    },

    _build_procedures: function _build_procedures() {
      return "<category name=\"Subtareas\" custom=\"PROCEDURE\"></category>";
    },

    _build_variables: function _build_variables() {
      return "<category name=\"Variables\" custom=\"VARIABLE\"></category>";
    }

  });

  /* ============================================== */

  /**
    Modelo de actividad
  **/
  var Actividad = Ember['default'].Object.extend({
    init: function init() {
      var actividad = this.get("actividad");
      this.set("nombre", actividad.nombre);
      this.set("enunciado", actividad.enunciado);
      this.set("escena", actividad.escena);
      this.set("puedeComentar", actividad.puedeComentar);
      this.set("puedeDesactivar", actividad.puedeDesactivar);
      this.set("puedeDuplicar", actividad.puedeDuplicar);
      this.setColours();
      this.pisar_bloques_blockly();
    },

    iniciarEscena: function iniciarEscena() {
      var Esc = this.get("escena");
      var esc_instance = new Esc();
      this.set("escena_instanciada", esc_instance);
      pilas.mundo.gestor_escenas.cambiar_escena(esc_instance);
    },

    obtenerLenguaje: function obtenerLenguaje() {
      var act = this.get("actividad");
      var leng = Lenguaje.create();

      leng.agregar("Acciones", act.acciones);
      leng.agregar("Sensores", act.sensores);
      leng.agregar("Control", act.control);
      leng.agregar("Expresiones", act.expresiones);
      leng.agregar("Variables", act.variables);
      leng.agregar("Subtareas", act.subtareas);

      return leng.build();
    },

    bloques_iniciales: function bloques_iniciales() {
      return [AlEmpezar];
    },

    crear_bloques_iniciales: function crear_bloques_iniciales() {
      this.bloques_iniciales().forEach(function (b) {
        b.create().instanciar_para_workspace();
      });
    },

    pisar_bloques_blockly: function pisar_bloques_blockly() {
      CallReturn.create().registrar_en_blockly();
      CallNoReturn.create().registrar_en_blockly();
      ParamGet.create().registrar_en_blockly();
      VariableGet.create().registrar_en_blockly();
      VariableSet.create().registrar_en_blockly();
      VariableLocalGet.create().registrar_en_blockly();
      VariableLocalSet.create().registrar_en_blockly();
    },

    usa_procedimientos: function usa_procedimientos() {
      return this.get("actividad").subtareas.indexOf(Procedimiento) > -1;
    },

    usa_funciones: function usa_funciones() {
      return this.get("actividad").subtareas.indexOf(Funcion) > -1;
    },

    iniciarBlockly: function iniciarBlockly(contenedor) {
      var actividad = this;

      Blockly.inject(contenedor, {
        collapse: false,
        duplicate: actividad.get("puedeDuplicar"),
        trashOnlyDelete: true,
        disable: actividad.get("puedeDesactivar"),
        comments: actividad.get("puedeComentar"),
        rgbColours: true,
        defsOnly: true,
        def_procedures: actividad.usa_procedimientos(),
        def_functions: actividad.usa_funciones(),
        globalVariables: false,
        oneReturnOnly: true,
        defsNames: ["al_empezar_a_ejecutar", "procedures_defnoreturn", "procedures_defreturn"],
        path: "./libs/blockly/",
        toolbox: Blockly.Xml.textToDom(actividad.obtenerLenguaje()) });

      this.crear_bloques_iniciales();
    },

    generarCodigo: function generarCodigo() {
      // variable global con la que se accede al receptor del programa
      window.receptor = this.get("escena_instanciada").automata;
      var comienzo = "var programa = new pilas.comportamientos.ConstructorDePrograma();\n\n";
      var code = Blockly.JavaScript.workspaceToCode();
      return comienzo + code;
    },

    // Scratch style colours
    setColours: function setColours() {
      Blockly.Blocks.primitivas.COLOUR = "#4a6cd4";
      Blockly.Blocks.sensores.COLOUR = "#2ca5e2";
      Blockly.Blocks.eventos.COLOUR = "#00a65a"; // == boton ejecutar
      Blockly.Blocks.math.COLOUR = "#49930e";
      Blockly.Blocks.logic.COLOUR = "#5cb712";
      Blockly.Blocks.loops.COLOUR = "#ee7d16";

      Blockly.Blocks.procedures.COLOUR = "#6C52EB";
      Blockly.Blocks.procedures.vars.COLOUR = "#8a55d7";
      Blockly.Blocks.procedures.params.COLOUR = "#6C52EB";

      Blockly.Blocks.variables.COLOUR = "#cc5b22";

      Blockly.Blocks.texts.COLOUR = "#4a6cd4";
      Blockly.Blocks.lists.COLOUR = "#cc5b22";
      Blockly.Blocks.colour.COLOUR = "#4a6cd4";

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

    obtener_codigo_en_texto: function obtener_codigo_en_texto() {
      var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      return Blockly.Xml.domToText(xml);
    } });

  /* ============================================== */

  var EscenaAlien = (function (_super) {
    __extends(EscenaAlien, _super);
    function EscenaAlien() {
      _super.apply(this, arguments);
    }

    EscenaAlien.prototype.coord_grilla = function (fila, columna) {
      var columnas = [-175, -105, -35, 35, 105, 175];
      var filas = [140, 60, -20, -100, -180];

      return { x: columnas[columna - 1], y: filas[fila - 1] };
    };

    EscenaAlien.prototype.iniciar = function () {

      new pilas.fondos.Laberinto1();
      var alien = new pilas.actores.Alien(-175, -180);

      this.automata = alien;

      // metodo para ver si choca con tuerca
      alien.choca_con_tuerca = function () {
        var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, "Tuerca");
        return actores.length > 0;
      };

      alien.cuando_busca_recoger = function () {
        var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, "Tuerca");
        if (actores.length > 0) {
          var mensaje = "";
          actores[0].eliminar();
          var restantes = pilas.obtener_actores_con_etiqueta("Tuerca").length;

          if (restantes > 0) {
            mensaje = "genial, aún quedan: " + restantes;
          } else {
            mensaje = "¡Nivel completado!";
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
    nombre: "El alien y las tuercas",
    enunciado: "Define un programa para que el alien junte todas las tuercas",
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
    Alien: Actividad.create({ actividad: actividadAlien }) };

  exports['default'] = Actividades;

  // espera:
  // + id
  // + categoria

  // abstracta

  // abstracta

  // pisado porque provisoriamente se
  // usa el que viene con blockly

  // pisado porque ya viene con blockly
  // ni tampoco quiero modificar el javascript

});
define('pilas-engine-bloques/actividades/actividadAlien', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  var Accion = bloques['default'].Accion;
  var Sensor = bloques['default'].Sensor;
  var Repetir = bloques['default'].Repetir;

  var EscenaAlien = (function (_super) {
    __extends(EscenaAlien, _super);
    function EscenaAlien() {
      _super.apply(this, arguments);
    }

    EscenaAlien.prototype.coord_grilla = function (fila, columna) {
      var columnas = [-175, -105, -35, 35, 105, 175];
      var filas = [140, 60, -20, -100, -180];

      return { x: columnas[columna - 1], y: filas[fila - 1] };
    };

    EscenaAlien.prototype.iniciar = function () {

      new pilas.fondos.Laberinto1();
      var alien = new pilas.actores.Alien(-175, -180);

      this.automata = alien;

      // metodo para ver si choca con tuerca
      alien.choca_con_tuerca = function () {
        var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, "Tuerca");
        return actores.length > 0;
      };

      alien.cuando_busca_recoger = function () {
        var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, "Tuerca");
        if (actores.length > 0) {
          var mensaje = "";
          actores[0].eliminar();
          var restantes = pilas.obtener_actores_con_etiqueta("Tuerca").length;

          if (restantes > 0) {
            mensaje = "genial, aún quedan: " + restantes;
          } else {
            mensaje = "¡Nivel completado!";
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

  var IrDerecha = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "ir_derecha");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("derecha.png")).appendField("ir derecha");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "MoverHaciaDerecha";
    },

    argumentos: function argumentos() {
      return "{cantidad: 68, tiempo: 1}";
    }

  });

  var IrIzquierda = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "ir_izquierda");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("izquierda.png")).appendField("ir izquierda");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "MoverHaciaIzquierda";
    },

    argumentos: function argumentos() {
      return "{cantidad: 68, tiempo: 1}";
    }

  });

  var IrArriba = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "ir_arriba");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("arriba.png")).appendField("ir arriba");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "MoverHaciaArriba";
    },

    argumentos: function argumentos() {
      return "{cantidad: 80, tiempo: 1}";
    }

  });

  var IrAbajo = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "ir_abajo");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("abajo.png")).appendField("ir abajo");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "MoverHaciaAbajo";
    },

    argumentos: function argumentos() {
      return "{cantidad: 80, tiempo: 1}";
    }

  });

  var Recoger = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "recoger");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField("recoger").appendField(new Blockly.FieldImage("libs/data/tuerca.png", 16, 16, "tuerca"));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "Recoger";
    },

    argumentos: function argumentos() {
      return "{tiempo: 1}";
    }

  });

  var ChocaConTuerca = Sensor.extend({
    init: function init() {
      this._super();
      this.set("id", "choca_con_tuerca");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField("choca con").appendField(new Blockly.FieldImage("libs/data/tuerca.png", 15, 15, "tuerca"));
    },

    nombre_sensor: function nombre_sensor() {
      return "choca_con_tuerca()";
    }
  });

  var actividadAlien = {
    nombre: "El alien y las tuercas",
    enunciado: "Define un programa para que el alien junte todas las tuercas",

    escena: EscenaAlien,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Repetir],
    expresiones: [],
    acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, Recoger],
    sensores: [ChocaConTuerca]
  };

  exports['default'] = actividadAlien;

});
define('pilas-engine-bloques/actividades/actividadElObreroCopado', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  var Accion = bloques['default'].Accion;
  var Sensor = bloques['default'].Sensor;

  var Avanzar = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "avanzar");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("izquierda.png")).appendField("avanzar");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "CaminaIzquierda";
    },

    argumentos: function argumentos() {
      return "{ pasos: 2 }";
    }
  });

  var Retroceder = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "retroceder");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("derecha.png")).appendField("retroceder");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "CaminaDerecha";
    },

    argumentos: function argumentos() {
      return "{ pasos: 2 }";
    }
  });

  var Martillar = Accion.extend({

    init: function init() {
      this._super();
      this.set("id", "martillar");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono("martillar.png")).appendField("martillar");
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return "Martillar";
    },

    argumentos: function argumentos() {
      return "{ veces: 20 }";
    }
  });

  var actividadElObreroCopado = {
    nombre: "El Obrero Copado",
    enunciado: "Ayudá a nuestro obrero",

    escena: ElObreroCopado,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [],
    expresiones: [],
    acciones: [Avanzar, Retroceder, Martillar],
    sensores: [] };

  exports['default'] = actividadElObreroCopado;

});
define('pilas-engine-bloques/actividades/bloques', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Bloque = Ember['default'].Object.extend({
    init: function init() {},

    block_init: function block_init() {},

    /*jshint unused: vars*/
    block_javascript: function block_javascript(block) {},

    registrar_en_blockly: function registrar_en_blockly() {
      var myThis = this;
      Blockly.Blocks[this.get("id")] = {
        init: function init() {
          myThis.block_init(this);
        }
      };

      Blockly.JavaScript[this.get("id")] = function (block) {
        return myThis.block_javascript(block);
      };
    },

    instanciar_para_workspace: function instanciar_para_workspace() {
      this.registrar_en_blockly();

      var block_dom = Blockly.Xml.textToDom("<xml>" + this.build() + "</xml>");

      Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), block_dom);
    },

    // reimplementar si se desean parametros ya aplicados
    get_parametros: function get_parametros() {
      return [];
    },

    obtener_icono: function obtener_icono(nombre) {
      return new Blockly.FieldImage("iconos/" + nombre, 16, 16, "<");
    },

    // Escupe el código que va en el toolbox para el bloque
    build: function build() {
      var str_block = "";
      str_block += "<block type=\"TIPO\">".replace("TIPO", this.get("id"));

      this.get_parametros().forEach(function (item) {
        str_block += item.build();
      });

      str_block += "</block>";
      return str_block;
    }
  });

  /*
   * Pide implementar sólo block_javascript
   * Sirve para pisar el JS que produce blockly
   */
  var CambioDeJSDeBlocky = Bloque.extend({

    registrar_en_blockly: function registrar_en_blockly() {
      var myThis = this;
      Blockly.JavaScript[this.get("id")] = function (block) {
        return myThis.block_javascript(block);
      };
    }
  });

  var VariableGet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "variables_get");
    },

    block_javascript: function block_javascript(block) {
      // Variable getter.
      var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE);
      return ["receptor.atributo(\"" + code + "\")", Blockly.JavaScript.ORDER_ATOMIC];
    }

  });

  var VariableSet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "variables_set");
    },

    block_javascript: function block_javascript(block) {
      // Variable setter.
      var argument0 = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ASSIGNMENT) || "0";
      var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE);
      return "programa.cambio_atributo(\"" + varName + "\", function(){ return " + argument0 + "; } );\n";
    }

  });

  /* ============================================== */

  var VariableLocalGet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "local_var_get");
    },

    block_javascript: function block_javascript(block) {
      // Variable getter.
      var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE);
      return ["receptor.variable(\"" + code + "\")", Blockly.JavaScript.ORDER_ATOMIC];
    }

  });

  /* ============================================== */

  var VariableLocalSet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "local_var_set");
    },

    block_javascript: function block_javascript(block) {
      // Variable setter.
      var argument0 = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ASSIGNMENT) || "0";
      var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE);
      return "programa.cambio_variable(\"" + varName + "\", function(){ return " + argument0 + "; } );\n";
    }

  });

  /* ============================================== */

  var Procedimiento = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "procedures_defnoreturn");
    },

    block_javascript: function block_javascript(block) {
      // Define a procedure with a return value.
      var funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("NAME"), Blockly.Procedures.NAME_TYPE);

      var branch = Blockly.JavaScript.statementToCode(block, "STACK");

      if (Blockly.JavaScript.STATEMENT_PREFIX) {
        branch = Blockly.JavaScript.prefixLines(Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g, "'" + block.id + "'"), Blockly.JavaScript.INDENT) + branch;
      }

      if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
        branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + block.id + "'") + branch;
      }

      var args = [];
      for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.variableDB_.getName(block.arguments_[x], Blockly.Variables.NAME_TYPE);
      }

      //    var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      //        branch + returnValue + '}';

      var args_string = args.map(function (i) {
        return "\"" + i + "\"";
      }).join(", ");

      var code = "programa.empezar_secuencia();\n" + branch + "programa.def_proc(\"" + funcName + "\", [" + args_string + "]);\n";

      code = Blockly.JavaScript.scrub_(block, code);
      Blockly.JavaScript.definitions_[funcName] = code;
      return null;
    }

  });

  /* ============================================== */

  var Funcion = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "procedures_defreturn");
    },

    registrar_en_blockly: function registrar_en_blockly() {}

  });

  /* ============================================== */

  var CallNoReturn = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "procedures_callnoreturn");
    },

    block_javascript: function block_javascript(block) {
      // Call a procedure with no return value.
      var funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("NAME"), Blockly.Procedures.NAME_TYPE);
      var args = [];
      for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.valueToCode(block, "ARG" + x, Blockly.JavaScript.ORDER_COMMA) || "null";
        args[x] = "function(){ return " + args[x] + "; }";
      }
      function juntar_args() {
        if (args.length > 0) {
          return "[\n" + args.join(", \n") + "\n]";
        } else {
          return "[]";
        }
      }
      // var code = funcName + '(' + args.join(', ') + ');\n';
      var code = "programa.llamada_proc(\"" + funcName + "\", " + juntar_args() + ");\n";
      return code;
    }

  });

  /* ============================================== */

  var CallReturn = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "procedures_callreturn");
    },

    block_javascript: function block_javascript(block) {
      // Call a procedure with a return value.
      var funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("NAME"), Blockly.Procedures.NAME_TYPE);
      var args = [];
      for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.valueToCode(block, "ARG" + x, Blockly.JavaScript.ORDER_COMMA) || "null";
        args[x] = "function(){ return " + args[x] + "; }";
      }
      var code = funcName + "(" + args.join(", ") + ")";
      return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    }

  });

  /* ============================================== */

  var ParamGet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set("id", "param_get");
    },

    block_javascript: function block_javascript(block) {
      // Variable getter.
      var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE);

      // agrego parentesis para llamar al closure del parametro
      return ["receptor.parametro(\"" + code + "\")", Blockly.JavaScript.ORDER_ATOMIC];
    }

  });

  /* ============================================== */

  var AlEmpezar = Bloque.extend({

    init: function init() {
      this._super();
      this.set("id", "al_empezar_a_ejecutar");
    },

    block_init: function block_init(block) {
      block.setColour(Blockly.Blocks.eventos.COLOUR);
      block.appendDummyInput().appendField("Al empezar a ejecutar");
      block.appendStatementInput("program");
      block.setDeletable(false);
      block.setEditable(false);
      block.setMovable(false);
    },

    block_javascript: function block_javascript(block) {
      var statements_program = Blockly.JavaScript.statementToCode(block, "program");
      var r = "programa.empezar_secuencia();\n";
      r += statements_program + "\n";
      r += "programa.ejecutar(receptor);\n";
      return r;
    }

  });

  var Accion = Bloque.extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.primitivas.COLOUR);
      block.setPreviousStatement(true);
      block.setNextStatement(true);
    },

    block_javascript: function block_javascript(block) {
      return "programa.hacer(" + this.nombre_comportamiento() + ", " + this.argumentos() + ")\n";
    }

  });

  var Sensor = Bloque.extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.sensores.COLOUR);
      block.setInputsInline(true);
      block.setOutput(true);
    },

    block_javascript: function block_javascript(block) {
      return ["receptor." + this.nombre_sensor() + "\n", Blockly.JavaScript.ORDER_ATOMIC];
    }
  });

  /*
   * Representa un valor mas complejo
   * de un campo de un bloque
   */
  var ParamValor = Ember['default'].Object.extend({
    build: function build() {
      var str_block = "";
      str_block += "<value name=\"NOMBRE\">".replace("NOMBRE", this.get("nombre_param"));

      str_block += "<block type=\"TIPO\">".replace("TIPO", this.get("tipo_bloque"));

      str_block += "<field name=\"TIPO\">".replace("TIPO", this.get("nombre_valor"));
      str_block += this.get("valor");
      str_block += "</field>";

      str_block += "</block>";

      str_block += "</value>";

      return str_block;
    }
  });

  /* ============================================== */

  var EstructuraDeControl = Bloque.extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.loops.COLOUR);
      block.setInputsInline(true);
      block.setPreviousStatement(true);
      block.setNextStatement(true);
    }

  });

  /* ============================================== */

  var Repetir = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set("id", "repetir");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput("count").setCheck("Number").appendField("repetir");
      block.appendStatementInput("block");
    },

    block_javascript: function block_javascript(block) {
      var value_count = Blockly.JavaScript.valueToCode(block, "count", Blockly.JavaScript.ORDER_ATOMIC) || "0";
      var statements_block = Blockly.JavaScript.statementToCode(block, "block");
      var r = "programa.empezar_secuencia();\n";
      r += statements_block;
      r += "programa.repetirN(function(){\nreturn {{n}};\n});\n".replace("{{n}}", value_count);
      return r;
    },

    get_parametros: function get_parametros() {
      return [ParamValor.create({
        nombre_param: "count",
        tipo_bloque: "math_number",
        nombre_valor: "NUM",
        valor: "10"
      })];
    }

  });

  var bloques = { Bloque: Bloque, CambioDeJSDeBlocky: CambioDeJSDeBlocky, VariableGet: VariableGet,
    VariableSet: VariableSet, VariableLocalGet: VariableLocalGet, VariableLocalSet: VariableLocalSet, Procedimiento: Procedimiento,
    Funcion: Funcion, CallNoReturn: CallNoReturn, CallReturn: CallReturn, ParamGet: ParamGet, AlEmpezar: AlEmpezar, Accion: Accion,
    Sensor: Sensor, Repetir: Repetir };

  exports['default'] = bloques;

  // espera:
  // + id
  // + categoria

  // abstracta

  // abstracta

  // pisado porque provisoriamente se
  // usa el que viene con blockly

});
define('pilas-engine-bloques/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].LSAdapter.extend({
    namespace: "pilas-engine-bloques_namespace"
  });

});
define('pilas-engine-bloques/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'pilas-engine-bloques/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var inflector = Ember['default'].Inflector.inflector;
  inflector.irregular("galeria", "galeria");

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('pilas-engine-bloques/components/em-button', ['exports', 'ember-idx-button/button'], function (exports, ButtonComponent) {

	'use strict';

	exports['default'] = ButtonComponent['default'];

});
define('pilas-engine-bloques/components/em-checkbox', ['exports', 'ember', 'ember-idx-forms/checkbox'], function (exports, Ember, CheckboxComponent) {

	'use strict';

	exports['default'] = CheckboxComponent['default'];

});
define('pilas-engine-bloques/components/em-form-control-help', ['exports', 'ember', 'ember-idx-forms/control_help'], function (exports, Ember, FormControlHelperComponent) {

	'use strict';

	exports['default'] = FormControlHelperComponent['default'];

});
define('pilas-engine-bloques/components/em-form-group', ['exports', 'ember', 'ember-idx-forms/group'], function (exports, Ember, FormGroupComponent) {

	'use strict';

	exports['default'] = FormGroupComponent['default'];

});
define('pilas-engine-bloques/components/em-form-label', ['exports', 'ember', 'ember-idx-forms/label'], function (exports, Ember, FormLabelComponent) {

	'use strict';

	exports['default'] = FormLabelComponent['default'];

});
define('pilas-engine-bloques/components/em-form-submit', ['exports', 'ember', 'ember-idx-forms/submit_button'], function (exports, Ember, SubmitButtonComponent) {

	'use strict';

	exports['default'] = SubmitButtonComponent['default'];

});
define('pilas-engine-bloques/components/em-form', ['exports', 'ember', 'ember-idx-forms/form'], function (exports, Ember, FormComponent) {

	'use strict';

	exports['default'] = FormComponent['default'];

});
define('pilas-engine-bloques/components/em-input', ['exports', 'ember', 'ember-idx-forms/input'], function (exports, Ember, InputComponent) {

	'use strict';

	exports['default'] = InputComponent['default'];

});
define('pilas-engine-bloques/components/em-modal-body', ['exports', 'ember-idx-modal/modal-body'], function (exports, BodyComponent) {

	'use strict';

	exports['default'] = BodyComponent['default'];

});
define('pilas-engine-bloques/components/em-modal-confirm-with-reason', ['exports', 'ember-idx-modal/modal-confirm-with-reason'], function (exports, ConfirmWithReasonModal) {

	'use strict';

	exports['default'] = ConfirmWithReasonModal['default'];

});
define('pilas-engine-bloques/components/em-modal-confirm', ['exports', 'ember-idx-modal/modal-confirm'], function (exports, ModalConfirm) {

	'use strict';

	exports['default'] = ModalConfirm['default'];

});
define('pilas-engine-bloques/components/em-modal-emform', ['exports', 'ember-idx-modal/modal-emform'], function (exports, ModalEmFormComponent) {

	'use strict';

	exports['default'] = ModalEmFormComponent['default'];

});
define('pilas-engine-bloques/components/em-modal-footer', ['exports', 'ember-idx-modal/modal-footer'], function (exports, FooterComponent) {

	'use strict';

	exports['default'] = FooterComponent['default'];

});
define('pilas-engine-bloques/components/em-modal-form', ['exports', 'ember-idx-modal/modal-form'], function (exports, ModalFormComponent) {

	'use strict';

	exports['default'] = ModalFormComponent['default'];

});
define('pilas-engine-bloques/components/em-modal-title', ['exports', 'ember-idx-modal/modal-title'], function (exports, TitleComponent) {

	'use strict';

	exports['default'] = TitleComponent['default'];

});
define('pilas-engine-bloques/components/em-modal-toggler', ['exports', 'ember-idx-modal/modal-toggler'], function (exports, TogglerComponent) {

	'use strict';

	exports['default'] = TogglerComponent['default'];

});
define('pilas-engine-bloques/components/em-modal', ['exports', 'ember-idx-modal/modal'], function (exports, ModalComponent) {

	'use strict';

	exports['default'] = ModalComponent['default'];

});
define('pilas-engine-bloques/components/em-select', ['exports', 'ember', 'ember-idx-forms/select'], function (exports, Ember, SelectComponent) {

	'use strict';

	exports['default'] = SelectComponent['default'];

});
define('pilas-engine-bloques/components/em-text', ['exports', 'ember', 'ember-idx-forms/text'], function (exports, Ember, TextComponent) {

	'use strict';

	exports['default'] = TextComponent['default'];

});
define('pilas-engine-bloques/components/lf-outlet', ['exports', 'liquid-fire/ember-internals'], function (exports, ember_internals) {

	'use strict';

	exports['default'] = ember_internals.StaticOutlet;

});
define('pilas-engine-bloques/components/lf-overlay', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var COUNTER = "__lf-modal-open-counter";

  exports['default'] = Ember['default'].Component.extend({
    tagName: "span",
    classNames: ["lf-overlay"],

    didInsertElement: function didInsertElement() {
      var body = Ember['default'].$("body");
      var counter = body.data(COUNTER) || 0;
      body.addClass("lf-modal-open");
      body.data(COUNTER, counter + 1);
    },

    willDestroy: function willDestroy() {
      var body = Ember['default'].$("body");
      var counter = body.data(COUNTER) || 0;
      body.data(COUNTER, counter - 1);
      if (counter < 2) {
        body.removeClass("lf-modal-open");
      }
    }
  });

});
define('pilas-engine-bloques/components/liquid-child', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["liquid-child"],
    attributeBindings: ["style"],
    style: Ember['default'].computed("visible", function () {
      return new Ember['default'].Handlebars.SafeString(this.get("visible") ? "" : "visibility:hidden");
    }),
    tellContainerWeRendered: Ember['default'].on("didInsertElement", function () {
      this.sendAction("didRender", this);
    })
  });

});
define('pilas-engine-bloques/components/liquid-container', ['exports', 'ember', 'liquid-fire/growable', 'pilas-engine-bloques/components/liquid-measured'], function (exports, Ember, Growable, liquid_measured) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend(Growable['default'], {
    classNames: ["liquid-container"],
    classNameBindings: ["liquidAnimating"],

    lockSize: function lockSize(elt, want) {
      elt.outerWidth(want.width);
      elt.outerHeight(want.height);
    },

    unlockSize: function unlockSize() {
      var _this = this;

      var doUnlock = function () {
        if (!_this.isDestroyed) {
          _this.set("liquidAnimating", false);
        }
        var elt = _this.$();
        if (elt) {
          elt.css({ width: "", height: "" });
        }
      };
      if (this._scaling) {
        this._scaling.then(doUnlock);
      } else {
        doUnlock();
      }
    },

    startMonitoringSize: Ember['default'].on("didInsertElement", function () {
      this._wasInserted = true;
    }),

    actions: {

      willTransition: function willTransition(versions) {
        if (!this._wasInserted) {
          return;
        }

        // Remember our own size before anything changes
        var elt = this.$();
        this._cachedSize = liquid_measured.measure(elt);

        // And make any children absolutely positioned with fixed sizes.
        for (var i = 0; i < versions.length; i++) {
          goAbsolute(versions[i]);
        }

        // Apply '.liquid-animating' to liquid-container allowing
        // any customizable CSS control while an animating is occuring
        this.set("liquidAnimating", true);
      },

      afterChildInsertion: function afterChildInsertion(versions) {
        var elt = this.$();

        // Measure  children
        var sizes = [];
        for (var i = 0; i < versions.length; i++) {
          if (versions[i].view) {
            sizes[i] = liquid_measured.measure(versions[i].view.$());
          }
        }

        // Measure ourself again to see how big the new children make
        // us.
        var want = liquid_measured.measure(elt);
        var have = this._cachedSize || want;

        // Make ourself absolute
        this.lockSize(elt, have);

        // Make the children absolute and fixed size.
        for (i = 0; i < versions.length; i++) {
          goAbsolute(versions[i], sizes[i]);
        }

        // Kick off our growth animation
        this._scaling = this.animateGrowth(elt, have, want);
      },

      afterTransition: function afterTransition(versions) {
        for (var i = 0; i < versions.length; i++) {
          goStatic(versions[i]);
        }
        this.unlockSize();
      }
    }
  });

  function goAbsolute(version, size) {
    if (!version.view) {
      return;
    }
    var elt = version.view.$();
    var pos = elt.position();
    if (!size) {
      size = liquid_measured.measure(elt);
    }
    elt.outerWidth(size.width);
    elt.outerHeight(size.height);
    elt.css({
      position: "absolute",
      top: pos.top,
      left: pos.left
    });
  }

  function goStatic(version) {
    if (version.view) {
      version.view.$().css({ width: "", height: "", position: "" });
    }
  }

});
define('pilas-engine-bloques/components/liquid-if', ['exports', 'ember', 'liquid-fire/ember-internals'], function (exports, Ember, ember_internals) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    _yieldInverse: ember_internals.inverseYieldMethod,
    hasInverse: Ember['default'].computed("inverseTemplate", function () {
      return !!this.get("inverseTemplate");
    })
  });

});
define('pilas-engine-bloques/components/liquid-measured', ['exports', 'liquid-fire/mutation-observer', 'ember'], function (exports, MutationObserver, Ember) {

  'use strict';

  exports.measure = measure;

  exports['default'] = Ember['default'].Component.extend({

    didInsertElement: function didInsertElement() {
      var self = this;

      // This prevents margin collapse
      this.$().css({
        overflow: "auto"
      });

      this.didMutate();

      this.observer = new MutationObserver['default'](function (mutations) {
        self.didMutate(mutations);
      });
      this.observer.observe(this.get("element"), {
        attributes: true,
        subtree: true,
        childList: true,
        characterData: true
      });
      this.$().bind("webkitTransitionEnd", function () {
        self.didMutate();
      });
      // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
      window.addEventListener("unload", function () {
        self.willDestroyElement();
      });
    },

    willDestroyElement: function willDestroyElement() {
      if (this.observer) {
        this.observer.disconnect();
      }
    },

    transitionMap: Ember['default'].inject.service("liquid-fire-transitions"),

    didMutate: function didMutate() {
      // by incrementing the running transitions counter here we prevent
      // tests from falling through the gap between the time they
      // triggered mutation the time we may actually animate in
      // response.
      var tmap = this.get("transitionMap");
      tmap.incrementRunningTransitions();
      Ember['default'].run.next(this, function () {
        this._didMutate();
        tmap.decrementRunningTransitions();
      });
    },

    _didMutate: function _didMutate() {
      var elt = this.$();
      if (!elt || !elt[0]) {
        return;
      }
      this.set("measurements", measure(elt));
    }

  });
  function measure($elt) {
    var width, height;

    // if jQuery sees a zero dimension, it will temporarily modify the
    // element's css to try to make its size measurable. But that's bad
    // for us here, because we'll get an infinite recursion of mutation
    // events. So we trap the zero case without hitting jQuery.

    if ($elt[0].offsetWidth === 0) {
      width = 0;
    } else {
      width = $elt.outerWidth();
    }
    if ($elt[0].offsetHeight === 0) {
      height = 0;
    } else {
      height = $elt.outerHeight();
    }

    return {
      width: width,
      height: height
    };
  }

});
define('pilas-engine-bloques/components/liquid-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["liquid-modal"],
    currentContext: Ember['default'].computed.oneWay("owner.modalContexts.lastObject"),

    owner: Ember['default'].inject.service("liquid-fire-modals"),

    innerView: Ember['default'].computed("currentContext", function () {
      var self = this,
          current = this.get("currentContext"),
          name = current.get("name"),
          container = this.get("container"),
          component = container.lookup("component-lookup:main").lookupFactory(name);
      Ember['default'].assert("Tried to render a modal using component '" + name + "', but couldn't find it.", !!component);

      var args = Ember['default'].copy(current.get("params"));

      args.registerMyself = Ember['default'].on("init", function () {
        self.set("innerViewInstance", this);
      });

      // set source so we can bind other params to it
      args._source = Ember['default'].computed(function () {
        return current.get("source");
      });

      var otherParams = current.get("options.otherParams");
      var from, to;
      for (from in otherParams) {
        to = otherParams[from];
        args[to] = Ember['default'].computed.alias("_source." + from);
      }

      var actions = current.get("options.actions") || {};

      // Override sendAction in the modal component so we can intercept and
      // dynamically dispatch to the controller as expected
      args.sendAction = function (name) {
        var actionName = actions[name];
        if (!actionName) {
          this._super.apply(this, Array.prototype.slice.call(arguments));
          return;
        }

        var controller = current.get("source");
        var args = Array.prototype.slice.call(arguments, 1);
        args.unshift(actionName);
        controller.send.apply(controller, args);
      };

      return component.extend(args);
    }),

    actions: {
      outsideClick: function outsideClick() {
        if (this.get("currentContext.options.dismissWithOutsideClick")) {
          this.send("dismiss");
        } else {
          proxyToInnerInstance(this, "outsideClick");
        }
      },
      escape: function escape() {
        if (this.get("currentContext.options.dismissWithEscape")) {
          this.send("dismiss");
        } else {
          proxyToInnerInstance(this, "escape");
        }
      },
      dismiss: function dismiss() {
        var source = this.get("currentContext.source"),
            proto = source.constructor.proto(),
            params = this.get("currentContext.options.withParams"),
            clearThem = {};

        for (var key in params) {
          clearThem[key] = proto[key];
        }
        source.setProperties(clearThem);
      }
    }
  });

  function proxyToInnerInstance(self, message) {
    var vi = self.get("innerViewInstance");
    if (vi) {
      vi.send(message);
    }
  }

});
define('pilas-engine-bloques/components/liquid-outlet', ['exports', 'ember', 'liquid-fire/ember-internals'], function (exports, Ember, ember_internals) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend(ember_internals.OutletBehavior);

});
define('pilas-engine-bloques/components/liquid-spacer', ['exports', 'pilas-engine-bloques/components/liquid-measured', 'liquid-fire/growable', 'ember'], function (exports, liquid_measured, Growable, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend(Growable['default'], {
    enabled: true,

    didInsertElement: function didInsertElement() {
      var child = this.$("> div");
      var measurements = this.myMeasurements(liquid_measured.measure(child));
      this.$().css({
        overflow: "hidden",
        outerWidth: measurements.width,
        outerHeight: measurements.height
      });
    },

    sizeChange: Ember['default'].observer("measurements", function () {
      if (!this.get("enabled")) {
        return;
      }
      var elt = this.$();
      if (!elt || !elt[0]) {
        return;
      }
      var want = this.myMeasurements(this.get("measurements"));
      var have = liquid_measured.measure(this.$());
      this.animateGrowth(elt, have, want);
    }),

    // given our child's outerWidth & outerHeight, figure out what our
    // outerWidth & outerHeight should be.
    myMeasurements: function myMeasurements(childMeasurements) {
      var elt = this.$();
      return {
        width: childMeasurements.width + sumCSS(elt, padding("width")) + sumCSS(elt, border("width")),
        height: childMeasurements.height + sumCSS(elt, padding("height")) + sumCSS(elt, border("height"))
      };
      //if (this.$().css('box-sizing') === 'border-box') {
    }

  });

  function sides(dimension) {
    return dimension === "width" ? ["Left", "Right"] : ["Top", "Bottom"];
  }

  function padding(dimension) {
    var s = sides(dimension);
    return ["padding" + s[0], "padding" + s[1]];
  }

  function border(dimension) {
    var s = sides(dimension);
    return ["border" + s[0] + "Width", "border" + s[1] + "Width"];
  }

  function sumCSS(elt, fields) {
    var accum = 0;
    for (var i = 0; i < fields.length; i++) {
      var num = parseFloat(elt.css(fields[i]), 10);
      if (!isNaN(num)) {
        accum += num;
      }
    }
    return accum;
  }

});
define('pilas-engine-bloques/components/liquid-versions', ['exports', 'ember', 'liquid-fire/ember-internals'], function (exports, Ember, ember_internals) {

  'use strict';

  var get = Ember['default'].get;
  var set = Ember['default'].set;

  exports['default'] = Ember['default'].Component.extend({
    tagName: "",
    name: "liquid-versions",

    transitionMap: Ember['default'].inject.service("liquid-fire-transitions"),

    appendVersion: Ember['default'].on("init", Ember['default'].observer("value", function () {
      var versions = get(this, "versions");
      var firstTime = false;
      var newValue = get(this, "value");
      var oldValue;

      if (!versions) {
        firstTime = true;
        versions = Ember['default'].A();
      } else {
        oldValue = versions[0];
      }

      // TODO: may need to extend the comparison to do the same kind of
      // key-based diffing that htmlbars is doing.
      if (!firstTime && (!oldValue && !newValue || oldValue === newValue)) {
        return;
      }

      this.notifyContainer("willTransition", versions);
      var newVersion = {
        value: newValue,
        shouldRender: newValue || get(this, "renderWhenFalse")
      };
      versions.unshiftObject(newVersion);

      this.firstTime = firstTime;
      if (firstTime) {
        set(this, "versions", versions);
      }

      if (!newVersion.shouldRender && !firstTime) {
        this._transition();
      }
    })),

    _transition: function _transition() {
      var _this = this;

      var versions = get(this, "versions");
      var transition;
      var firstTime = this.firstTime;
      this.firstTime = false;

      this.notifyContainer("afterChildInsertion", versions);

      transition = get(this, "transitionMap").transitionFor({
        versions: versions,
        parentElement: Ember['default'].$(ember_internals.containingElement(this)),
        use: get(this, "use"),
        // Using strings instead of booleans here is an
        // optimization. The constraint system can match them more
        // efficiently, since it treats boolean constraints as generic
        // "match anything truthy/falsy" predicates, whereas string
        // checks are a direct object property lookup.
        firstTime: firstTime ? "yes" : "no",
        helperName: get(this, "name")
      });

      if (this._runningTransition) {
        this._runningTransition.interrupt();
      }
      this._runningTransition = transition;

      transition.run().then(function (wasInterrupted) {
        // if we were interrupted, we don't handle the cleanup because
        // another transition has already taken over.
        if (!wasInterrupted) {
          _this.finalizeVersions(versions);
          _this.notifyContainer("afterTransition", versions);
        }
      }, function (err) {
        _this.finalizeVersions(versions);
        _this.notifyContainer("afterTransition", versions);
        throw err;
      });
    },

    finalizeVersions: function finalizeVersions(versions) {
      versions.replace(1, versions.length - 1);
    },

    notifyContainer: function notifyContainer(method, versions) {
      var target = get(this, "notify");
      if (target) {
        target.send(method, versions);
      }
    },

    actions: {
      childDidRender: function childDidRender(child) {
        var version = get(child, "version");
        set(version, "view", child);
        this._transition();
      }
    }

  });

});
define('pilas-engine-bloques/components/liquid-with', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    name: "liquid-with"
  });

});
define('pilas-engine-bloques/components/lm-container', ['exports', 'ember', 'liquid-fire/tabbable'], function (exports, Ember) {

  'use strict';

  /*
     Parts of this file were adapted from ic-modal

     https://github.com/instructure/ic-modal
     Released under The MIT License (MIT)
     Copyright (c) 2014 Instructure, Inc.
  */

  var lastOpenedModal = null;
  Ember['default'].$(document).on("focusin", handleTabIntoBrowser);

  function handleTabIntoBrowser() {
    if (lastOpenedModal) {
      lastOpenedModal.focus();
    }
  }

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["lm-container"],
    attributeBindings: ["tabindex"],
    tabindex: 0,

    keyUp: function keyUp(event) {
      // Escape key
      if (event.keyCode === 27) {
        this.sendAction();
      }
    },

    keyDown: function keyDown(event) {
      // Tab key
      if (event.keyCode === 9) {
        this.constrainTabNavigation(event);
      }
    },

    didInsertElement: function didInsertElement() {
      this.focus();
      lastOpenedModal = this;
    },

    willDestroy: function willDestroy() {
      lastOpenedModal = null;
    },

    focus: function focus() {
      if (this.get("element").contains(document.activeElement)) {
        // just let it be if we already contain the activeElement
        return;
      }
      var target = this.$("[autofocus]");
      if (!target.length) {
        target = this.$(":tabbable");
      }

      if (!target.length) {
        target = this.$();
      }

      target[0].focus();
    },

    constrainTabNavigation: function constrainTabNavigation(event) {
      var tabbable = this.$(":tabbable");
      var finalTabbable = tabbable[event.shiftKey ? "first" : "last"]()[0];
      var leavingFinalTabbable = finalTabbable === document.activeElement ||
      // handle immediate shift+tab after opening with mouse
      this.get("element") === document.activeElement;
      if (!leavingFinalTabbable) {
        return;
      }
      event.preventDefault();
      tabbable[event.shiftKey ? "last" : "first"]()[0].focus();
    },

    click: function click(event) {
      if (event.target === this.get("element")) {
        this.sendAction("clickAway");
      }
    }
  });

});
define('pilas-engine-bloques/components/nw-zoom', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "div",
    classNames: ["nw-zoom"],
    zoomValue: 100,
    zoom: Ember['default'].inject.service(),

    canZoomIn: (function () {
      return this.get("zoomValue") < 120;
    }).property("zoomValue"),

    canZoomOut: (function () {
      return this.get("zoomValue") > 80;
    }).property("zoomValue"),

    cambiarZoom: (function () {
      var gui = window.requireNode("nw.gui");
      var win = gui.Window.get();
      this.get("zoom").setValue(this.get("zoomValue"));

      win.zoomLevel = (this.get("zoomValue") - 100) / 10;
    }).observes("zoomValue"),

    onStart: (function () {
      this.set("zoomValue", this.get("zoom").getValue());
      this.cambiarZoom();
    }).on("init"),

    actions: {
      zoomIn: function zoomIn() {
        this.set("zoomValue", this.get("zoomValue") + 10);
      },
      zoomOut: function zoomOut() {
        this.set("zoomValue", this.get("zoomValue") - 10);
      },
      zoomRestore: function zoomRestore() {
        this.set("zoomValue", 100);
      }
    } });

});
define('pilas-engine-bloques/components/pilas-blockly', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    ejecutando: false,
    cola_deshacer: [],
    data_observar_blockly: false,
    actividad: null,

    twitter: Ember['default'].inject.service(),
    previewData: null, // representa la imagen previsualización del dialogo para twittear.
    mensajeCompartir: "Comparto mi solución de pilas-engine-bloques @hugoruscitti",
    compartirEnCurso: false,
    browser: Ember['default'].inject.service(),

    inyectarRedimensionado: (function () {

      window.anterior_altura = 0;
      window.anterior_ancho = 0;
      var ancho_canvas = 445;

      function redimensionar() {
        var panel = document.getElementById("panel-derecho");
        var contenedorEditor = document.getElementById("contenedor-editor");
        var panelPilas = document.getElementById("panel-pilas");
        var e = document.getElementById("contenedor-blockly");

        if (!panel) {
          return null;
        }

        var altura = panel.getClientRects()[0].height;
        var ancho_total = contenedorEditor.getClientRects()[0].width;

        if (window.anterior_altura !== altura || window.anterior_ancho !== ancho_total) {

          e.style.width = ancho_total - ancho_canvas + "px";
          e.style.height = altura - 50 + "px";
          panelPilas.style.width = ancho_canvas - 20 + "px";

          window.anterior_altura = altura;
          window.anterior_ancho = ancho_total;

          Blockly.fireUiEvent(window, "resize");
        }
      }

      function forzar_redimensionado() {
        window.anterior_altura += 1;
        redimensionar();
      }

      window.onresize = redimensionar;
      window.forzar_redimensionado = forzar_redimensionado;
    }).on("init"),

    iniciarBlockly: (function () {
      var contenedor = this.$().find("#contenedor-blockly")[0];
      this.set("cola_deshacer", []);
      //this.cargar_codigo_desde_el_modelo();
      //this.observarCambiosEnBlocky();
    }).on("didInsertElement"),

    /**
     * Se conecta a los eventos y cambios de estado de blockly para implementar
     * la funcionalidad de 'deshacer'.
     */
    observarCambiosEnBlocky: function observarCambiosEnBlocky() {
      var f = this.almacenar_cambio.bind(this);
      var d = Blockly.addChangeListener(f);
      this.set("data_observar_blockly", d);
    },

    noMirarCambiosEnBlockly: function noMirarCambiosEnBlockly() {
      if (this.get("data_observar_blockly")) {
        Blockly.removeChangeListener(this.get("data_observar_blockly"));
      }
    },

    almacenar_cambio: function almacenar_cambio() {
      this.get("cola_deshacer").pushObject(this.obtener_codigo_en_texto());
      console.log("guardar");
    },

    restaurar_codigo: function restaurar_codigo(codigo) {
      var xml = Blockly.Xml.textToDom(codigo);
      Blockly.mainWorkspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml);
    },

    obtener_codigo_en_texto: function obtener_codigo_en_texto() {
      var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      return Blockly.Xml.domToText(xml);
    },

    cargar_codigo_desde_el_modelo: function cargar_codigo_desde_el_modelo() {
      if (this.get("model")) {
        var modelo = this.get("model");
        var codigo = modelo.get("codigo");
        this.restaurar_codigo(codigo);
      }
      this.sendAction("registrarPrimerCodigo");
    },

    actions: {
      ejecutar: function ejecutar() {
        window.LoopTrap = 1000;
        //this.sendAction('reiniciar');
        Blockly.JavaScript.INFINITE_LOOP_TRAP = "if (--window.LoopTrap == 0) throw \"Infinite loop.\";\n";

        var code = this.get("actividad").generarCodigo();
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

        try {
          this.set("ejecutando", true);
          eval(code);
          this.sendAction("parar");
        } catch (e) {
          console.error(e.stack);
          alert(e);
        }
      },
      reiniciar: function reiniciar() {
        this.set("ejecutando", false);
        this.sendAction("reiniciar");
      },
      guardar: function guardar() {
        this.sendAction("guardar");
      },
      alternar: function alternar() {
        //this.sendAction('redimensionar');
        console.log(this.controllerFor("application"));
        //.sendAction('redimensionar');
      },
      ver_codigo: function ver_codigo() {
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        var code = this.get("actividad").generarCodigo();
        alert(code);
      },
      deshacer_cambio: function deshacer_cambio() {
        this.noMirarCambiosEnBlockly();
        this.get("cola_deshacer").popObject();
        var c = this.get("cola_deshacer").popObject();
        if (c) {
          console.log("deshacer");
          this.restaurar_codigo(c);
        }
        this.observarCambiosEnBlocky();
      },

      compartir: function compartir() {
        this.set("abrirDialogoCompartir", true);
        var data = canvas.toDataURL("image/png");
        this.set("previewData", data);
      },

      abrirMensajePublicado: function abrirMensajePublicado() {
        var url = this.get("mensajePublicadoURL");
        this.get("browser").openLink(url);
      },

      enviarMensaje: function enviarMensaje() {
        var _this = this;

        this.set("envioEnCurso", true);

        var mensaje = this.get("mensajeCompartir");
        var imagen = this.get("previewData");

        this.get("twitter").compartir(mensaje, imagen).then(function (data) {
          _this.set("envioEnCurso", false);
          _this.set("mensajePublicadoURL", data.url);
        })["catch"](function (err) {
          alert(err);
          _this.set("envioEnCurso", false);
        });
      }

    } });

});
define('pilas-engine-bloques/components/pilas-canvas', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actividad: null,

    iniciarPilas: (function () {
      var canvas_element = this.$().find("canvas")[0];

      window.pilas = pilasengine.iniciar({
        ancho: 420,
        alto: 480,
        canvas: canvas_element,
        data_path: "libs/data",

        imagenesExtra: ["fondos.estrellas.png", "fondos.obrero.png", "fondos.nubes.png", "casillaLightbot.png", "perro_cohete.png", "hueso.png", "mock_llave.png", "mock_caballero.png", "mock_cofre.png", "mock_heroe.png", "mock_mago.png", "mock_unicornio.png", "casillaArriba.png", "casillaAbajo.png", "casillaDerecha.png", "casillaIzquierda.png", "banana.png", "manzana.png", "casilla_base.png", "robot.png", "casilla_con_luz.png", "invisible.png", "sin_imagen.png", "maria.png", "sandia.png", "compu_animada.png", "globoAnimado.png", "cangrejo.png", "buzo.png", "fondos.mar.png", "pez1.png", "pez2.png", "pez3.png", "alimento_pez.png", "ratonAnimado.png", "quesoAnimado.png", "naveAnimada.png", "robotAnimado.png", "pelotaAnimada.png", "fondos.biblioteca.png", "fondos.reparandoLaNave.png", "casilla.reparandoNave.png", "marcianoVerdeAnimado.png", "carbon_animado.png", "hierro_animado.png"]
      });

      window.pilas.onready = (function () {
        this.get("actividad").iniciarEscena();

        var contenedor = document.getElementById("contenedor-blockly");
        this.get("actividad").iniciarBlockly(contenedor);
      }).bind(this);

      window.pilas.ejecutar();
    }).on("didInsertElement") });

});
define('pilas-engine-bloques/components/pilas-desafio', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["desafio"],
    nombre: null,
    deshabilitada: false,

    actions: {
      abrir: function abrir() {
        this.sendAction("onSelect", this.get("nombre"));
      }
    }
  });

});
define('pilas-engine-bloques/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Bootstrap = window.Bootstrap;

  exports['default'] = Ember['default'].Controller.extend({
    url: "",
    queryParams: ["layout"],
    layout: true,
    environment: Ember['default'].inject.service(),

    mostrar_url: (function () {
      var controller = this;

      var actualizar = function actualizar() {
        controller.set("url", window.location.href);
      };

      setInterval(actualizar, 100);

      this.set("layout", this.get("environment").get("showLayout"));
    }).on("init"),

    myModalButtons: [Ember['default'].Object.create({ title: "Cerrar", dismiss: "modal" })],

    actions: {
      mostrar_devtools: function mostrar_devtools() {
        window.requireNode("nw.gui").Window.get().showDevTools();
      },
      actualizar: function actualizar() {
        location.reload(true);
      },
      redimensionar: function redimensionar() {
        alert("tengo que redimensionar!");
      }
    }

  });

});
define('pilas-engine-bloques/controllers/desafios/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    actions: {
      onSelect: function onSelect(name) {
        this.transitionToRoute("desafios.nombre", name);
      }
    }
  });

});
define('pilas-engine-bloques/controllers/editor', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    //actividad: Actividades.Alien,
    nombre_al_guardar: "mi actividad",
    tmp_codigo_xml: "",

    debeGuardar: function debeGuardar() {
      var codigo_xml = this.get("actividad").obtener_codigo_en_texto();
      return codigo_xml !== this.get("tmp_codigo_xml");
    },

    inyectarRedimensionado: (function () {

      window.anterior_altura = 0;
      window.anterior_ancho = 0;
      var ancho_canvas = 445;

      function redimensionar() {
        var panel = document.getElementById("panel-derecho");
        var contenedorEditor = document.getElementById("contenedor-editor");
        var panelPilas = document.getElementById("panel-pilas");
        var e = document.getElementById("contenedor-blockly");

        if (!panel) {
          return null;
        }

        var altura = panel.getClientRects()[0].height;
        var ancho_total = contenedorEditor.getClientRects()[0].width;

        if (window.anterior_altura !== altura || window.anterior_ancho !== ancho_total) {

          e.style.width = ancho_total - ancho_canvas + "px";
          e.style.height = altura - 50 + "px";
          panelPilas.style.width = ancho_canvas - 20 + "px";

          window.anterior_altura = altura;
          window.anterior_ancho = ancho_total;

          Blockly.fireUiEvent(window, "resize");
        }
      }

      function forzar_redimensionado() {
        window.anterior_altura += 1;
        redimensionar();
      }

      window.onresize = redimensionar;
      window.forzar_redimensionado = forzar_redimensionado;
    }).on("init"),

    "botones-modal-guardar": [Ember['default'].Object.create({ title: "Guardar y ver en la galería", clicked: "guardarEnGaleriaYRedireccionar" }), Ember['default'].Object.create({ title: "Guardar y continuar", clicked: "guardarEnGaleria", dismiss: "modal" }), Ember['default'].Object.create({ title: "Cerrar", dismiss: "modal" })],

    actions: {
      registrarPrimerCodigo: function registrarPrimerCodigo() {
        var codigo_xml = this.get("actividad").obtener_codigo_en_texto();
        this.set("tmp_codigo_xml", codigo_xml);
        if (this.get("model")) {
          this.set("nombre_al_guardar", this.get("model").get("nombre"));
        }
      },

      guardar: function guardar() {
        var codigo_xml = this.get("actividad").obtener_codigo_en_texto();
        this.set("tmp_codigo_xml", codigo_xml);
        return Bootstrap.ModalManager.show("modal-guardar");
      },

      guardarEnGaleriaYRedireccionar: function guardarEnGaleriaYRedireccionar() {
        this.send("guardarEnGaleria");
        this.transitionToRoute("galeria");
      },

      guardarEnGaleria: function guardarEnGaleria() {
        //alert("test");
        var imagen = document.getElementById("canvas");
        var imagen_data = imagen.toDataURL("image/png");

        var juego = this.get("model");

        if (juego) {
          juego.set("nombre", this.get("nombre_al_guardar"));
          juego.set("imagen", imagen_data);
          juego.set("codigo", this.get("tmp_codigo_xml"));
        } else {
          juego = this.store.createRecord("galeria", {
            nombre: this.get("nombre_al_guardar"),
            imagen: imagen_data,
            codigo: this.get("tmp_codigo_xml")
          });
        }

        juego.save();
      },

      reiniciar: function reiniciar() {
        this.get("actividad").iniciarEscena();
      }
    }
  });

});
define('pilas-engine-bloques/controllers/galeria', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({
    actions: {
      eliminar: function eliminar(record) {
        record.destroyRecord();
      },

      abrir: function abrir(record) {
        this.transitionToRoute("editor", record);
      } }
  });

});
define('pilas-engine-bloques/controllers/iframe', ['exports', 'ember', 'pilas-engine-bloques/actividades'], function (exports, Ember, Actividades) {

  'use strict';

  var Bootstrap = window.Bootstrap;

  exports['default'] = Ember['default'].Controller.extend({
    queryParams: ["layout"],
    layout: true,
    actividad: Actividades['default'].Alien,
    nombre_al_guardar: "mi actividad",
    tmp_codigo_xml: "",

    debeGuardar: function debeGuardar() {
      var codigo_xml = this.get("actividad").obtener_codigo_en_texto();
      return codigo_xml !== this.get("tmp_codigo_xml");
    },

    inyectarRedimensionado: (function () {

      window.anterior_altura = 0;
      window.anterior_ancho = 0;
      var ancho_canvas = 445;

      function redimensionar() {
        var panel = document.getElementById("panel-derecho");
        var contenedorEditor = document.getElementById("contenedor-editor");
        var panelPilas = document.getElementById("panel-pilas");
        var e = document.getElementById("contenedor-blockly");

        if (!panel) {
          return null;
        }

        var altura = panel.getClientRects()[0].height;
        var ancho_total = contenedorEditor.getClientRects()[0].width;

        if (window.anterior_altura !== altura || window.anterior_ancho !== ancho_total) {

          e.style.width = ancho_total - ancho_canvas + "px";
          e.style.height = altura - 50 + "px";
          panelPilas.style.width = ancho_canvas - 20 + "px";

          window.anterior_altura = altura;
          window.anterior_ancho = ancho_total;

          Blockly.fireUiEvent(window, "resize");
        }
      }

      function forzar_redimensionado() {
        window.anterior_altura += 1;
        redimensionar();
      }

      window.onresize = redimensionar;
      window.forzar_redimensionado = forzar_redimensionado;
    }).on("init"),

    "botones-modal-guardar": [Ember['default'].Object.create({ title: "Guardar y ver en la galería", clicked: "guardarEnGaleriaYRedireccionar" }), Ember['default'].Object.create({ title: "Guardar y continuar", clicked: "guardarEnGaleria", dismiss: "modal" }), Ember['default'].Object.create({ title: "Cerrar", dismiss: "modal" })],

    actions: {
      registrarPrimerCodigo: function registrarPrimerCodigo() {
        var codigo_xml = this.get("actividad").obtener_codigo_en_texto();
        this.set("tmp_codigo_xml", codigo_xml);
        if (this.get("model")) {
          this.set("nombre_al_guardar", this.get("model").get("nombre"));
        }
      },

      guardar: function guardar() {
        var codigo_xml = this.get("actividad").obtener_codigo_en_texto();
        this.set("tmp_codigo_xml", codigo_xml);
        return Bootstrap.ModalManager.show("modal-guardar");
      },

      guardarEnGaleriaYRedireccionar: function guardarEnGaleriaYRedireccionar() {
        this.send("guardarEnGaleria");
        this.transitionToRoute("galeria");
      },

      guardarEnGaleria: function guardarEnGaleria() {
        var imagen = document.getElementById("canvas");
        var imagen_data = imagen.toDataURL("image/png");

        var juego = this.get("model");

        if (juego) {
          juego.set("nombre", this.get("nombre_al_guardar"));
          juego.set("imagen", imagen_data);
          juego.set("codigo", this.get("tmp_codigo_xml"));
        } else {
          juego = this.store.createRecord("galeria", {
            nombre: this.get("nombre_al_guardar"),
            imagen: imagen_data,
            codigo: this.get("tmp_codigo_xml")
          });
        }

        juego.save();
      },

      reiniciar: function reiniciar() {
        this.get("actividad").iniciarEscena();
      }
    }
  });

});
define('pilas-engine-bloques/controllers/preferencia', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    edicion: false,
    actions: {
      guardar: function guardar() {
        var record = this.store.find("preferencium", { tipo: "principal" });
        record.save();

        model.save().then(function () {
          this.set("edicion", false);
        });
      },
      editar: function editar() {
        this.set("edicion", true);
      } }
  });

});
define('pilas-engine-bloques/helpers/fa-icon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FA_PREFIX = /^fa\-.+/;

  var warn = Ember['default'].Logger.warn;

  /**
   * Handlebars helper for generating HTML that renders a FontAwesome icon.
   *
   * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
   *                          For example, you can pass in either `fa-camera` or just `camera`.
   * @param  {Object} options Options passed to helper.
   * @return {Ember.Handlebars.SafeString} The HTML markup.
   */
  var faIcon = function faIcon(name, options) {
    if (Ember['default'].typeOf(name) !== "string") {
      var message = "fa-icon: no icon specified";
      warn(message);
      return Ember['default'].String.htmlSafe(message);
    }

    var params = options.hash,
        classNames = [],
        html = "";

    classNames.push("fa");
    if (!name.match(FA_PREFIX)) {
      name = "fa-" + name;
    }
    classNames.push(name);
    if (params.spin) {
      classNames.push("fa-spin");
    }
    if (params.flip) {
      classNames.push("fa-flip-" + params.flip);
    }
    if (params.rotate) {
      classNames.push("fa-rotate-" + params.rotate);
    }
    if (params.lg) {
      warn("fa-icon: the 'lg' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"lg\"}}");
      classNames.push("fa-lg");
    }
    if (params.x) {
      warn("fa-icon: the 'x' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"" + params.x + "\"}}");
      classNames.push("fa-" + params.x + "x");
    }
    if (params.size) {
      if (Ember['default'].typeOf(params.size) === "string" && params.size.match(/\d+/)) {
        params.size = Number(params.size);
      }
      if (Ember['default'].typeOf(params.size) === "number") {
        classNames.push("fa-" + params.size + "x");
      } else {
        classNames.push("fa-" + params.size);
      }
    }
    if (params.fixedWidth) {
      classNames.push("fa-fw");
    }
    if (params.listItem) {
      classNames.push("fa-li");
    }
    if (params.pull) {
      classNames.push("pull-" + params.pull);
    }
    if (params.border) {
      classNames.push("fa-border");
    }
    if (params.classNames && !Ember['default'].isArray(params.classNames)) {
      params.classNames = [params.classNames];
    }
    if (!Ember['default'].isEmpty(params.classNames)) {
      Array.prototype.push.apply(classNames, params.classNames);
    }

    html += "<";
    var tagName = params.tagName || "i";
    html += tagName;
    html += " class='" + classNames.join(" ") + "'";
    if (params.title) {
      html += " title='" + params.title + "'";
    }
    if (params.ariaHidden === undefined || params.ariaHidden) {
      html += " aria-hidden=\"true\"";
    }
    html += "></" + tagName + ">";
    return Ember['default'].String.htmlSafe(html);
  };

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(faIcon);

  exports.faIcon = faIcon;

});
define('pilas-engine-bloques/helpers/lf-yield-inverse', ['exports', 'liquid-fire/ember-internals'], function (exports, ember_internals) {

  'use strict';

  exports['default'] = {
    isHTMLBars: true,
    helperFunction: ember_internals.inverseYieldHelper
  };

});
define('pilas-engine-bloques/helpers/liquid-bind', ['exports', 'liquid-fire/ember-internals'], function (exports, ember_internals) {

	'use strict';

	exports['default'] = ember_internals.makeHelperShim("liquid-bind");

});
define('pilas-engine-bloques/helpers/liquid-if', ['exports', 'liquid-fire/ember-internals'], function (exports, ember_internals) {

  'use strict';

  exports['default'] = ember_internals.makeHelperShim("liquid-if", function (params, hash, options) {
    hash.helperName = "liquid-if";
    hash.inverseTemplate = options.inverse;
  });

});
define('pilas-engine-bloques/helpers/liquid-outlet', ['exports', 'liquid-fire/ember-internals'], function (exports, ember_internals) {

  'use strict';

  exports['default'] = ember_internals.makeHelperShim("liquid-outlet", function (params, hash) {
    hash._outletName = params[0] || "main";
  });

});
define('pilas-engine-bloques/helpers/liquid-unless', ['exports', 'liquid-fire/ember-internals'], function (exports, ember_internals) {

  'use strict';

  exports['default'] = ember_internals.makeHelperShim("liquid-if", function (params, hash, options) {
    hash.helperName = "liquid-unless";
    hash.inverseTemplate = options.template;
    options.template = options.inverse;
  });

});
define('pilas-engine-bloques/helpers/liquid-with', ['exports', 'liquid-fire/ember-internals'], function (exports, ember_internals) {

	'use strict';

	exports['default'] = ember_internals.makeHelperShim("liquid-with");

});
define('pilas-engine-bloques/initialize', ['exports', 'ember', 'ember-idx-utils/config'], function (exports, Em, IdxConfig) {

  'use strict';

  exports['default'] = {
    name: "ember-idx-utils",
    initialize: function initialize() {
      if (!Em['default'].IdxConfig) {
        Em['default'].IdxConfig = IdxConfig['default'].create();
      }
    }
  };

});
define('pilas-engine-bloques/initializers/app-version', ['exports', 'pilas-engine-bloques/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('pilas-engine-bloques/initializers/ember-idx-modal', ['exports', 'ember', 'ember-idx-utils/config'], function (exports, Em, IdxConfig) {

    'use strict';

    exports['default'] = {
        name: "ember-idx-modal",
        initialize: function initialize() {
            var Config = Em['default'].IdxConfig = Em['default'].IdxConfig ? Em['default'].IdxConfig : IdxConfig['default'].create();

            var defaultConfig = Config.getConfig("bs");
            if (!defaultConfig) {
                Config.addConfig("bs");
                defaultConfig = Config.getConfig("bs");
            }

            defaultConfig.modal = {
                classes: ["em-modal", "modal", "fade"],
                bodyClasses: ["modal-body"],
                titleClasses: ["modal-header"],
                footerClasses: ["modal-footer"]
            };
        }
    };

});
define('pilas-engine-bloques/initializers/export-application-global', ['exports', 'ember', 'pilas-engine-bloques/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('pilas-engine-bloques/initializers/liquid-fire', ['exports', 'liquid-fire/router-dsl-ext'], function (exports) {

  'use strict';

  // This initializer exists only to make sure that the following import
  // happens before the app boots.
  exports['default'] = {
    name: "liquid-fire",
    initialize: function initialize() {}
  };

});
define('pilas-engine-bloques/models/galeria', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    nombre: DS['default'].attr("string"),
    codigo: DS['default'].attr("string"),
    imagen: DS['default'].attr("string") });

});
define('pilas-engine-bloques/models/preferencium', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    nombre: DS['default'].attr("string"),
    tipo: DS['default'].attr("string") });

});
define('pilas-engine-bloques/router', ['exports', 'ember', 'pilas-engine-bloques/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route("about");
    this.route("version");
    this.route("preferencia");
    this.resource("editor", { path: "/editor/:galeria_id" });
    this.route("galeria");
    this.route("iframe");
    this.route("test");
    this.resource("desafios", function () {
      this.route("nombre", { path: ":nombre" });
    });
  });

  exports['default'] = Router;

});
define('pilas-engine-bloques/routes/desafios', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('pilas-engine-bloques/routes/desafios/nombre', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    actividades: Ember['default'].inject.service(),
    actividadActual: null,

    model: function model(param) {
      var _this = this;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        var actividad = _this.get("actividades").obtenerPorNombre(param.nombre);
        _this.set("actividadActual", actividad);

        if (!actividad) {
          var msg = "ERROR: no existe un desafio con ese nombre";
          return reject(msg);
        }

        return resolve({ actividad: actividad });
      });
    },

    actions: {
      reiniciar: function reiniciar() {
        this.get("actividadActual").iniciarEscena();
      }
    }
  });

});
define('pilas-engine-bloques/routes/editor', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model(params) {
      if (params.galeria_id !== "new") {
        return this.store.find("galeria", params.galeria_id);
      } else {
        return null;
      }
    },
    actions: {
      willTransition: function willTransition(transition) {
        var b = this.controllerFor("editor").debeGuardar();
        if (b) {
          transition.abort();
          this.controllerFor("editor").send("guardar");
        } else {
          // Bubble the `willTransition` action so that
          // parent routes can decide whether or not to abort.
          return true;
        }
      }
    }

  });

});
define('pilas-engine-bloques/routes/galeria', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return this.store.find("galeria");
    }
  });

});
define('pilas-engine-bloques/routes/iframe', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return null;
    }
  });

});
define('pilas-engine-bloques/routes/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('pilas-engine-bloques/routes/preferencia', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      var record = this.store.find("preferencium", { tipo: "principal" });
      var controller = this;

      record.then(function (data) {
        return data;
      })["catch"](function (err) {
        return controller.store.createRecord("preferencium", {
          tipo: "principal",
          nombre: "nombre sin definir"
        }).save();
      });
    }
  });

});
define('pilas-engine-bloques/routes/test', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    actividades: Ember['default'].inject.service(),

    model: function model() {
      var actividad = this.get("actividades").obtenerPorNombre("alien");

      return { actividad: actividad };
    }
  });

});
define('pilas-engine-bloques/routes/tips', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('pilas-engine-bloques/serializers/application', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].LSSerializer.extend();

});
define('pilas-engine-bloques/services/actividades', ['exports', 'ember', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/actividadElObreroCopado', 'pilas-engine-bloques/actividades/actividadAlien'], function (exports, Ember, bloques, actividadElObreroCopado, actividadAlien) {

  'use strict';

  Blockly.Blocks.primitivas = { COLOUR: "#4a6cd4" };
  Blockly.Blocks.sensores = { COLOUR: "#4a6cd4" };
  Blockly.Blocks.eventos = { COLOUR: "#4a6cd4" };

  /* ============================================== */

  var Bloque = bloques['default'].Bloque;
  var CambioDeJSDeBlocky = bloques['default'].CambioDeJSDeBlocky;
  var VariableGet = bloques['default'].VariableGet;
  var VariableSet = bloques['default'].VariableSet;
  var VariableLocalGet = bloques['default'].VariableLocalGet;
  var VariableLocalSet = bloques['default'].VariableLocalSet;
  var Procedimiento = bloques['default'].Procedimiento;
  var Funcion = bloques['default'].Funcion;
  var CallNoReturn = bloques['default'].CallNoReturn;
  var CallReturn = bloques['default'].CallReturn;
  var ParamGet = bloques['default'].ParamGet;
  var AlEmpezar = bloques['default'].AlEmpezar;
  var Accion = bloques['default'].Accion;
  var Sensor = bloques['default'].Sensor;

  /* ============================================== */

  var EstructuraDeControl = Bloque.extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.loops.COLOUR);
      block.setInputsInline(true);
      block.setPreviousStatement(true);
      block.setNextStatement(true);
    }

  });

  /* ============================================== */

  var Repetir = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set("id", "repetir");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput("count").setCheck("Number").appendField("repetir");
      block.appendStatementInput("block");
    },

    block_javascript: function block_javascript(block) {
      var value_count = Blockly.JavaScript.valueToCode(block, "count", Blockly.JavaScript.ORDER_ATOMIC) || "0";
      var statements_block = Blockly.JavaScript.statementToCode(block, "block");
      var r = "programa.empezar_secuencia();\n";
      r += statements_block;
      r += "programa.repetirN(function(){\nreturn {{n}};\n});\n".replace("{{n}}", value_count);
      return r;
    },

    get_parametros: function get_parametros() {
      return [ParamValor.create({
        nombre_param: "count",
        tipo_bloque: "math_number",
        nombre_valor: "NUM",
        valor: "10"
      })];
    }

  });

  /* ============================================== */

  var Si = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set("id", "si");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput("condition").setCheck("Boolean").appendField("si");
      block.appendStatementInput("block");
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, "condition", Blockly.JavaScript.ORDER_ATOMIC) || "false";
      var statements_block = Blockly.JavaScript.statementToCode(block, "block");
      var r = "programa.empezar_secuencia();\n";
      r += statements_block;
      r += "programa.alternativa_si(function(){\nreturn {{condition}};\n});\n".replace("{{condition}}", value_condition);
      return r;
    }

  });

  /* ============================================== */

  var Sino = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set("id", "sino");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput("condition").setCheck("Boolean").appendField("si");
      block.appendStatementInput("block1");
      block.appendDummyInput().appendField("sino");
      block.appendStatementInput("block2");
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, "condition", Blockly.JavaScript.ORDER_ATOMIC) || "false";
      var statements_block1 = Blockly.JavaScript.statementToCode(block, "block1");
      var statements_block2 = Blockly.JavaScript.statementToCode(block, "block2");
      var r = "programa.empezar_secuencia();\n";
      r += statements_block1;
      r += "programa.empezar_secuencia();\n";
      r += statements_block2;
      r += "programa.alternativa_sino(function(){\nreturn {{condition}};\n});\n".replace("{{condition}}", value_condition);
      return r;
    }

  });

  /* ============================================== */

  var Hasta = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set("id", "hasta");
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput("condition").setCheck("Boolean").appendField("repetir hasta que");
      block.appendStatementInput("block");
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, "condition", Blockly.JavaScript.ORDER_ATOMIC) || "true";
      var statements_block = Blockly.JavaScript.statementToCode(block, "block");
      var r = "programa.empezar_secuencia();\n";
      r += statements_block;
      r += "programa.repetir_hasta(function(){\nreturn {{condition}};\n});\n".replace("{{condition}}", value_condition);
      return r;
    }

  });

  var ExpresionDeBlockly = Bloque.extend({

    registrar_en_blockly: function registrar_en_blockly() {}

  });

  var Numero = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "math_number");
    } });

  var OpAritmetica = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "math_arithmetic");
    } });

  var Booleano = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "logic_boolean");
    } });

  var OpComparacion = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "logic_compare");
    } });

  var OpLogica = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "logic_operation");
    } });

  var OpNegacion = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set("id", "logic_negate");
    } });

  /* ============================================== */

  /*
   * Representa el valor
   * de un campo string de un bloque
   */
  /*exported ParamCampo*/
  var ParamCampo = Ember['default'].Object.extend({
    build: function build() {
      var str_block = "";
      str_block += "<field name=\"NOMBRE\">".replace("NOMBRE", this.get("nombre_valor"));
      str_block += this.get("valor");
      str_block += "</field>";
      return str_block;
    }
  });

  /* ============================================== */

  /*
   * Representa un valor mas complejo
   * de un campo de un bloque
   */
  var ParamValor = Ember['default'].Object.extend({
    build: function build() {
      var str_block = "";
      str_block += "<value name=\"NOMBRE\">".replace("NOMBRE", this.get("nombre_param"));

      str_block += "<block type=\"TIPO\">".replace("TIPO", this.get("tipo_bloque"));

      str_block += "<field name=\"TIPO\">".replace("TIPO", this.get("nombre_valor"));
      str_block += this.get("valor");
      str_block += "</field>";

      str_block += "</block>";

      str_block += "</value>";

      return str_block;
    }
  });

  /* ============================================== */

  /*
   * Representa el lenguaje que podra utilizarse
   * en una actividad
   */
  var Lenguaje = Ember['default'].Object.extend({

    init: function init() {
      this.set("categorias", []);
      this.set("bloques", {});
    },

    agregar: function agregar(c, bs) {
      if (bs !== undefined) {
        this.categoria(c);
        bs.forEach((function (b) {
          this.bloque(c, b);
        }).bind(this));
      }
    },

    categoria: function categoria(c) {
      this.get("categorias").pushObject(c);
      var bs = this.get("bloques");
      bs[c] = [];
      this.set("bloques", bs);
    },

    bloque: function bloque(c, b) {
      var block = this.definir_bloque(b);
      this.get("bloques")[c].pushObject(block);
    },

    definir_bloque: function definir_bloque(b) {
      var block = b.create();
      block.registrar_en_blockly();
      return block;
    },

    build: function build() {
      var str_toolbox = "";

      str_toolbox += "<xml>";

      this.get("categorias").forEach((function (item) {
        if (item === "Variables") {
          str_toolbox += this._build_variables();
        } else if (item === "Subtareas") {
          str_toolbox += this._build_procedures();
        } else {
          str_toolbox += this._build_categoria(item);
        }
      }).bind(this));

      str_toolbox += "</xml>";

      return str_toolbox;
    },

    _build_categoria: function _build_categoria(categoria) {
      var str_category = "";

      str_category += "<category name=\"x\">\n".replace("x", categoria);

      this.get("bloques")[categoria].forEach(function (b) {
        str_category += b.build();
      });

      str_category += "</category>\n";

      return str_category;
    },

    _build_procedures: function _build_procedures() {
      return "<category name=\"Subtareas\" custom=\"PROCEDURE\"></category>";
    },

    _build_variables: function _build_variables() {
      return "<category name=\"Variables\" custom=\"VARIABLE\"></category>";
    }

  });

  /* ============================================== */

  /**
    Modelo de actividad
  **/
  var Actividad = Ember['default'].Object.extend({
    init: function init() {
      var actividad = this.get("actividad");
      this.set("nombre", actividad.nombre);
      this.set("enunciado", actividad.enunciado);
      this.set("escena", actividad.escena);
      this.set("puedeComentar", actividad.puedeComentar);
      this.set("puedeDesactivar", actividad.puedeDesactivar);
      this.set("puedeDuplicar", actividad.puedeDuplicar);
      this.setColours();
      this.pisar_bloques_blockly();
    },

    iniciarEscena: function iniciarEscena() {
      var Esc = this.get("escena");
      var esc_instance = new Esc();
      this.set("escena_instanciada", esc_instance);
      pilas.mundo.gestor_escenas.cambiar_escena(esc_instance);
    },

    obtenerLenguaje: function obtenerLenguaje() {
      var act = this.get("actividad");
      var leng = Lenguaje.create();

      leng.agregar("Acciones", act.acciones);
      leng.agregar("Sensores", act.sensores);
      leng.agregar("Control", act.control);
      leng.agregar("Expresiones", act.expresiones);
      leng.agregar("Variables", act.variables);
      leng.agregar("Subtareas", act.subtareas);

      return leng.build();
    },

    bloques_iniciales: function bloques_iniciales() {
      return [AlEmpezar];
    },

    crear_bloques_iniciales: function crear_bloques_iniciales() {
      this.bloques_iniciales().forEach(function (b) {
        b.create().instanciar_para_workspace();
      });
    },

    pisar_bloques_blockly: function pisar_bloques_blockly() {
      CallReturn.create().registrar_en_blockly();
      CallNoReturn.create().registrar_en_blockly();
      ParamGet.create().registrar_en_blockly();
      VariableGet.create().registrar_en_blockly();
      VariableSet.create().registrar_en_blockly();
      VariableLocalGet.create().registrar_en_blockly();
      VariableLocalSet.create().registrar_en_blockly();
    },

    usa_procedimientos: function usa_procedimientos() {
      return this.get("actividad").subtareas.indexOf(Procedimiento) > -1;
    },

    usa_funciones: function usa_funciones() {
      return this.get("actividad").subtareas.indexOf(Funcion) > -1;
    },

    iniciarBlockly: function iniciarBlockly(contenedor) {
      var actividad = this;

      Blockly.inject(contenedor, {
        collapse: false,
        duplicate: actividad.get("puedeDuplicar"),
        trashOnlyDelete: true,
        disable: actividad.get("puedeDesactivar"),
        comments: actividad.get("puedeComentar"),
        rgbColours: true,
        defsOnly: true,
        def_procedures: actividad.usa_procedimientos(),
        def_functions: actividad.usa_funciones(),
        globalVariables: false,
        oneReturnOnly: true,
        defsNames: ["al_empezar_a_ejecutar", "procedures_defnoreturn", "procedures_defreturn"],
        path: "./libs/blockly/",
        toolbox: Blockly.Xml.textToDom(actividad.obtenerLenguaje()) });

      this.crear_bloques_iniciales();
    },

    generarCodigo: function generarCodigo() {
      // variable global con la que se accede al receptor del programa
      window.receptor = this.get("escena_instanciada").automata;
      var comienzo = "var programa = new pilas.comportamientos.ConstructorDePrograma();\n\n";
      var code = Blockly.JavaScript.workspaceToCode();
      return comienzo + code;
    },

    // Scratch style colours
    setColours: function setColours() {
      Blockly.Blocks.primitivas.COLOUR = "#4a6cd4";
      Blockly.Blocks.sensores.COLOUR = "#2ca5e2";
      Blockly.Blocks.eventos.COLOUR = "#00a65a"; // == boton ejecutar
      Blockly.Blocks.math.COLOUR = "#49930e";
      Blockly.Blocks.logic.COLOUR = "#5cb712";
      Blockly.Blocks.loops.COLOUR = "#ee7d16";

      Blockly.Blocks.procedures.COLOUR = "#6C52EB";
      //Blockly.Blocks.procedures.vars.COLOUR = '#8a55d7';
      //Blockly.Blocks.procedures.params.COLOUR = '#6C52EB';

      Blockly.Blocks.variables.COLOUR = "#cc5b22";

      Blockly.Blocks.texts.COLOUR = "#4a6cd4";
      Blockly.Blocks.lists.COLOUR = "#cc5b22";
      Blockly.Blocks.colour.COLOUR = "#4a6cd4";

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

    obtener_codigo_en_texto: function obtener_codigo_en_texto() {
      var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      return Blockly.Xml.domToText(xml);
    } });

  exports['default'] = Ember['default'].Service.extend({
    obtenerPorNombre: function obtenerPorNombre(nombreActividad) {

      var actividades = {
        alien: actividadAlien['default'],
        ElObreroCopado: actividadElObreroCopado['default'] };

      var actividad = actividades[nombreActividad];

      if (!actividad) {
        return null;
      }

      return Actividad.create({ actividad: actividad });
    }
  });

  // pisado porque ya viene con blockly
  // ni tampoco quiero modificar el javascript

});
define('pilas-engine-bloques/services/browser', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isNode = typeof process !== "undefined" && typeof require !== "undefined";
  var isNodeWebkit = false;

  //Is this Node.js?
  if (isNode) {
    //If so, test for Node-Webkit
    try {
      isNodeWebkit = typeof require("nw.gui") !== "undefined";
    } catch (e) {
      isNodeWebkit = false;
    }
  }

  exports['default'] = Ember['default'].Service.extend({
    openLink: function openLink(url) {
      if (isNodeWebkit) {
        var gui = window.requireNode("nw.gui");
        gui.Shell.openExternal(url);
      } else {
        window.open(url);
      }
    }
  });

});
define('pilas-engine-bloques/services/environment', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Service.extend({
    env: null,
    showLayout: null,

    loadProperties: (function () {
      this.set("env", this.container.lookupFactory("config:environment"));
      this.set("showLayout", this.get("env").showLayout);
    }).on("init"),

    getENV: function getENV() {
      return this.get("env");
    }
  });

});
define('pilas-engine-bloques/services/liquid-fire-modals', ['exports', 'liquid-fire/modals'], function (exports, Modals) {

	'use strict';

	exports['default'] = Modals['default'];

});
define('pilas-engine-bloques/services/liquid-fire-transitions', ['exports', 'liquid-fire/transition-map'], function (exports, TransitionMap) {

	'use strict';

	exports['default'] = TransitionMap['default'];

});
define('pilas-engine-bloques/services/twitter', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var URL = "http://104.131.245.133:9914/sendMessage";

  exports['default'] = Ember['default'].Service.extend({
    compartir: function compartir(mensaje, imagen) {
      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        $.ajax({
          url: URL,
          type: "POST",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            message: mensaje,
            media: imagen
          }),
          success: function success(res) {
            resolve(res);
          },
          error: function error(xhr, status, errorThrown) {
            console.error(xhr.responseText);
            reject(xhr.responseText);
          }
        });
      });
    }
  });

});
define('pilas-engine-bloques/services/validations', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var set = Ember['default'].set;

  exports['default'] = Ember['default'].Service.extend({
    init: function init() {
      set(this, "cache", {});
    }
  });

});
define('pilas-engine-bloques/services/zoom', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Service.extend({
    zoom: 100,

    getValue: function getValue() {
      return this.get("zoom");
    },

    setValue: function setValue(zoomValue) {
      this.set("zoom", zoomValue);
    }
  });

});
define('pilas-engine-bloques/templates/-compartir', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("×");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("h4");
            dom.setAttribute(el1,"class","modal-title");
            var el2 = dom.createTextNode("Compartir en twitter");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            block(env, morph0, context, "em-modal-toggler", [], {"class": "close"}, child0, null);
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("button");
              dom.setAttribute(el1,"class","btn btn-info");
              dom.setAttribute(el1,"disabled","");
              var el2 = dom.createElement("i");
              dom.setAttribute(el2,"class","fa fa-twitter");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode(" Compartiendo ...");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("button");
              dom.setAttribute(el1,"class","btn btn-info");
              var el2 = dom.createElement("i");
              dom.setAttribute(el2,"class","fa fa-twitter");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode(" Compartir");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, element = hooks.element;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element1 = dom.childAt(fragment, [1]);
              element(env, element1, context, "action", ["enviarMensaje"], {});
              return fragment;
            }
          };
        }());
        var child2 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","compartir-mensaje");
              var el2 = dom.createTextNode("\n        Listo, tu mensaje fué publicado en twitter,\n        ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("a");
              dom.setAttribute(el2,"href","");
              var el3 = dom.createTextNode("¿querés abrirlo?");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode(".\n      ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, element = hooks.element;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element0 = dom.childAt(fragment, [1, 1]);
              element(env, element0, context, "action", ["abrirMensajePublicado"], {});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","modal-inline-block  float-left");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("img");
            dom.setAttribute(el2,"id","preview");
            dom.setAttribute(el2,"width","210");
            dom.setAttribute(el2,"height","240");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","modal-inline-block");
            var el2 = dom.createTextNode("\n\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","fila-opcion");
            var el3 = dom.createTextNode("\n        Mensaje: ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","fila-opcion");
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, attribute = hooks.attribute, inline = hooks.inline, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element2 = dom.childAt(fragment, [1, 1]);
            var element3 = dom.childAt(fragment, [3]);
            var attrMorph0 = dom.createAttrMorph(element2, 'src');
            var morph0 = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
            var morph1 = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
            var morph2 = dom.createMorphAt(element3,5,5);
            attribute(env, attrMorph0, element2, "src", get(env, context, "previewData"));
            inline(env, morph0, context, "textarea", [], {"class": "modal-mensaje-compartir", "rows": 3, "value": get(env, context, "mensajeCompartir")});
            block(env, morph1, context, "if", [get(env, context, "envioEnCurso")], {}, child0, child1);
            block(env, morph2, context, "if", [get(env, context, "mensajePublicadoURL")], {}, child2, null);
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("Cerrar");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            block(env, morph0, context, "em-modal-toggler", [], {"class": "btn btn-default"}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          var morph1 = dom.createMorphAt(fragment,3,3,contextualElement);
          var morph2 = dom.createMorphAt(fragment,5,5,contextualElement);
          block(env, morph0, context, "em-modal-title", [], {}, child0, null);
          block(env, morph1, context, "em-modal-body", [], {}, child1, null);
          block(env, morph2, context, "em-modal-footer", [], {"style": "clear:both"}, child2, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("id is important, so we can reference it on the toggler component");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, null);
        block(env, morph0, context, "em-modal", [], {"configName": "bs", "open-if": get(env, context, "abrirDialogoCompartir")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/-modal', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("×");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("h4");
            dom.setAttribute(el1,"class","modal-title");
            var el2 = dom.createTextNode("Opciones");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            block(env, morph0, context, "em-modal-toggler", [], {"class": "close"}, child0, null);
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","fila-opcion");
            var el2 = dom.createTextNode("\n      Herramientas de desarrollo:\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"class","btn btn-success btn-sm");
            var el3 = dom.createElement("i");
            dom.setAttribute(el3,"class","glyphicon glyphicon glyphicon-refresh");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode(" Actualizar");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"class","btn btn-info btn-sm");
            var el3 = dom.createElement("i");
            dom.setAttribute(el3,"class","glyphicon glyphicon glyphicon-cog");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode(" Mostrar devtools");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","fila-opcion");
            var el2 = dom.createTextNode("\n      Tamaño de interfaz: ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            var element1 = dom.childAt(element0, [1]);
            var element2 = dom.childAt(element0, [3]);
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
            element(env, element1, context, "action", ["actualizar"], {});
            element(env, element2, context, "action", ["mostrar_devtools"], {});
            content(env, morph0, context, "nw-zoom");
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("Cerrar");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            block(env, morph0, context, "em-modal-toggler", [], {"class": "btn btn-default"}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          var morph1 = dom.createMorphAt(fragment,3,3,contextualElement);
          var morph2 = dom.createMorphAt(fragment,5,5,contextualElement);
          dom.insertBoundary(fragment, null);
          block(env, morph0, context, "em-modal-title", [], {}, child0, null);
          block(env, morph1, context, "em-modal-body", [], {}, child1, null);
          block(env, morph2, context, "em-modal-footer", [], {}, child2, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("id is important, so we can reference it on the toggler component");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, null);
        block(env, morph0, context, "em-modal", [], {"configName": "bs", "id": "modal1"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/-navbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("Principal");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("Desafios");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("Galería");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          inline(env, morph0, context, "fa-icon", ["gear"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"class","navbar navbar-default");
        dom.setAttribute(el1,"role","navigation");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container-fluid");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Brand and toggle get grouped for better mobile display ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","navbar-header navbar-collapse");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","navbar-brand");
        dom.setAttribute(el4,"href","#");
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"src","images/logo.png");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Collect the nav links, forms, and other content for toggling ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"id","bs-example-navbar-collapse-1");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","nav navbar-nav");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","header-right");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1, 7]);
        var element1 = dom.childAt(element0, [1]);
        var morph0 = dom.createMorphAt(element1,1,1);
        var morph1 = dom.createMorphAt(element1,3,3);
        var morph2 = dom.createMorphAt(element1,5,5);
        var morph3 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        block(env, morph0, context, "link-to", ["index"], {"tagName": "li"}, child0, null);
        block(env, morph1, context, "link-to", ["desafios"], {"tagName": "li"}, child1, null);
        block(env, morph2, context, "link-to", ["galeria"], {"tagName": "li"}, child2, null);
        block(env, morph3, context, "em-modal-toggler", [], {"modal-id": "modal1", "class": "header-button"}, child3, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          var morph1 = dom.createMorphAt(fragment,3,3,contextualElement);
          inline(env, morph0, context, "partial", ["navbar"], {});
          inline(env, morph1, context, "partial", ["modal"], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("style");
          var el2 = dom.createTextNode("\n    .absolute {\n      top: 10px;\n    }\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","page-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "layout")], {}, child0, child1);
        inline(env, morph1, context, "liquid-outlet", [], {"class": "absolute"});
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/em-button', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          element(env, element0, context, "bind-attr", [], {"class": "icon-classes"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(fragment,1,1,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "icon-classes")], {}, child0, null);
        content(env, morph1, context, "label");
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/em-form-control-help', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "helpText");
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/em-form-group', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element0,1,1);
          element(env, element0, context, "bind-attr", [], {"class": get(env, context, "wrapperClass")});
          inline(env, morph0, context, "partial", ["components/formgroup/form-group"], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "partial", ["components/formgroup/form-group"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "wrapperClass")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/em-form-label', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "yield");
        content(env, morph1, context, "text");
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/em-form-submit', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1]);
          var element2 = dom.childAt(element1, [1]);
          var morph0 = dom.createMorphAt(element2,0,0);
          element(env, element1, context, "bind-attr", [], {"class": get(env, context, "horiClass")});
          element(env, element2, context, "bind-attr", [], {"class": get(env, context, "classes")});
          element(env, element2, context, "bind-attr", [], {"disabled": get(env, context, "disabled")});
          content(env, morph0, context, "text");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element0,0,0);
          element(env, element0, context, "bind-attr", [], {"class": get(env, context, "classes")});
          element(env, element0, context, "bind-attr", [], {"disabled": get(env, context, "disabled")});
          content(env, morph0, context, "text");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "form.isHorizontal")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/em-form', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          content(env, morph0, context, "em-form-submit");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "yield");
        block(env, morph1, context, "if", [get(env, context, "submit_button")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/em-modal-confirm', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createElement("span");
              dom.setAttribute(el1,"aria-hidden","true");
              var el2 = dom.createTextNode("×");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("span");
              dom.setAttribute(el1,"class","sr-only");
              var el2 = dom.createTextNode("Close");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("h4");
            dom.setAttribute(el1,"class","modal-title");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, block = hooks.block, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
            block(env, morph0, context, "em-modal-toggler", [], {"class": "close"}, child0, null);
            content(env, morph1, context, "title");
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
              inline(env, morph0, context, "view", [get(env, context, "Ember.Select")], {"valueBinding": "message", "contentBinding": "messages", "optionValuePath": "id", "optionLabelPath": "content.msg"});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("Confirmation with a reason");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            var morph1 = dom.createMorphAt(fragment,3,3,contextualElement);
            var morph2 = dom.createMorphAt(fragment,7,7,contextualElement);
            dom.insertBoundary(fragment, null);
            content(env, morph0, context, "message");
            content(env, morph1, context, "yield");
            block(env, morph2, context, "if", [get(env, context, "reasonModal")], {}, child0, null);
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("            ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("i");
              dom.setAttribute(el1,"class","fa fa-thumbs-o-down");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n            ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,3,3,contextualElement);
              content(env, morph0, context, "cancel-button-title");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            var morph1 = dom.createMorphAt(fragment,3,3,contextualElement);
            dom.insertBoundary(fragment, null);
            inline(env, morph0, context, "em-button", [], {"class": get(env, context, "cancel-button-classes"), "on-click": "confirmPressed", "default": get(env, context, "submit-button-title"), "icon-default": get(env, context, "submit-button-default-icons"), "icon-executing": get(env, context, "submit-button-execute-icons"), "executing": get(env, context, "submit-button-submitting-title")});
            block(env, morph1, context, "em-modal-toggler", [], {"class": get(env, context, "submit-button-classes")}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          var morph1 = dom.createMorphAt(fragment,1,1,contextualElement);
          var morph2 = dom.createMorphAt(fragment,2,2,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "em-modal-title", [], {"classes": get(env, context, "modal-title-classes")}, child0, null);
          block(env, morph1, context, "em-modal-body", [], {}, child1, null);
          block(env, morph2, context, "em-modal-footer", [], {}, child2, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "em-modal", [], {"id": get(env, context, "confirm-id"), "configName": get(env, context, "configName"), "model-id": get(env, context, "model-id"), "open-if": get(env, context, "open-if"), "close-if": get(env, context, "close-if"), "on-hide": get(env, context, "on-hide")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/em-modal', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","modal-dialog");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","modal-content");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 1]),1,1);
          content(env, morph0, context, "yield");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "is-open")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/formgroup/control-within-label', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "partial", ["components/formgroup/form-group-control"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "em-form-label", [], {"text": get(env, context, "label"), "horiClass": "", "inlineClass": "", "viewName": get(env, context, "labelViewName")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/formgroup/form-group-control', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element0,1,1);
          element(env, element0, context, "bind-attr", [], {"class": get(env, context, "controlWrapper")});
          inline(env, morph0, context, "view", [get(env, context, "controlView")], {"viewName": get(env, context, "controlViewName"), "property": get(env, context, "propertyName"), "id": get(env, context, "cid")});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "view", [get(env, context, "controlView")], {"viewName": get(env, context, "controlViewName"), "property": get(env, context, "propertyName"), "id": get(env, context, "cid")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "controlWrapper")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/formgroup/form-group', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          var child0 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.11.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("div");
                var el2 = dom.createTextNode("\n                    ");
                dom.appendChild(el1, el2);
                var el2 = dom.createComment("");
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n                ");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, element = hooks.element, inline = hooks.inline;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var element2 = dom.childAt(fragment, [1]);
                var morph0 = dom.createMorphAt(element2,1,1);
                element(env, element2, context, "bind-attr", [], {"class": get(env, context, "labelWrapperClass")});
                inline(env, morph0, context, "partial", ["components/formgroup/control-within-label"], {});
                return fragment;
              }
            };
          }());
          var child1 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.11.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                ");
                dom.appendChild(el0, el1);
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, inline = hooks.inline;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
                inline(env, morph0, context, "partial", ["components/formgroup/control-within-label"], {});
                return fragment;
              }
            };
          }());
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, block = hooks.block;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, null);
              dom.insertBoundary(fragment, 0);
              block(env, morph0, context, "if", [get(env, context, "labelWrapperClass")], {}, child0, child1);
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          var child0 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.11.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("div");
                var el2 = dom.createTextNode("\n                    ");
                dom.appendChild(el1, el2);
                var el2 = dom.createComment("");
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n                    ");
                dom.appendChild(el1, el2);
                var el2 = dom.createComment("");
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n                ");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, element = hooks.element, inline = hooks.inline;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var element1 = dom.childAt(fragment, [1]);
                var morph0 = dom.createMorphAt(element1,1,1);
                var morph1 = dom.createMorphAt(element1,3,3);
                element(env, element1, context, "bind-attr", [], {"class": get(env, context, "labelWrapperClass")});
                inline(env, morph0, context, "em-form-label", [], {"text": get(env, context, "label"), "viewName": get(env, context, "labelViewName")});
                inline(env, morph1, context, "partial", ["components/formgroup/form-group-control"], {});
                return fragment;
              }
            };
          }());
          var child1 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.11.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                ");
                dom.appendChild(el0, el1);
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n                ");
                dom.appendChild(el0, el1);
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
                var morph1 = dom.createMorphAt(fragment,3,3,contextualElement);
                inline(env, morph0, context, "em-form-label", [], {"text": get(env, context, "label"), "viewName": get(env, context, "labelViewName")});
                inline(env, morph1, context, "partial", ["components/formgroup/form-group-control"], {});
                return fragment;
              }
            };
          }());
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, block = hooks.block;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, null);
              dom.insertBoundary(fragment, 0);
              block(env, morph0, context, "if", [get(env, context, "labelWrapperClass")], {}, child0, child1);
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            block(env, morph0, context, "if", [get(env, context, "yieldInLabel")], {}, child0, child1);
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            inline(env, morph0, context, "partial", ["components/formgroup/form-group-control"], {});
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            dom.setAttribute(el1,"class","form-control-feedback");
            var el2 = dom.createElement("i");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1, 0]);
            element(env, element0, context, "bind-attr", [], {"class": get(env, context, "v_icon")});
            return fragment;
          }
        };
      }());
      var child3 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("            ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
              inline(env, morph0, context, "em-form-control-help", [], {"text": get(env, context, "help"), "viewName": get(env, context, "helpViewName")});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            block(env, morph0, context, "if", [get(env, context, "canShowErrors")], {}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
          var morph2 = dom.createMorphAt(fragment,4,4,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "if", [get(env, context, "label")], {}, child0, child1);
          block(env, morph1, context, "if", [get(env, context, "v_icons")], {}, child2, null);
          block(env, morph2, context, "unless", [get(env, context, "form.isInline")], {}, child3, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          content(env, morph0, context, "yield");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "unless", [get(env, context, "template")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/liquid-bind', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            set(env, context, "version", blockArguments[0]);
            content(env, morph0, context, "version");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "liquid-versions", [], {"value": get(env, context, "value"), "use": get(env, context, "use"), "name": "liquid-bind", "renderWhenFalse": true}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 1,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement, blockArguments) {
              var dom = env.dom;
              var hooks = env.hooks, set = hooks.set, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, null);
              dom.insertBoundary(fragment, 0);
              set(env, context, "version", blockArguments[0]);
              content(env, morph0, context, "version");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            set(env, context, "container", blockArguments[0]);
            block(env, morph0, context, "liquid-versions", [], {"value": get(env, context, "value"), "notify": get(env, context, "container"), "use": get(env, context, "use"), "name": "liquid-bind", "renderWhenFalse": true}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "liquid-container", [], {"id": get(env, context, "innerId"), "class": get(env, context, "innerClass")}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "containerless")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/liquid-container', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "yield", [get(env, context, "this")], {});
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/liquid-if', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
              content(env, morph0, context, "yield");
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
              content(env, morph0, context, "lf-yield-inverse");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            set(env, context, "valueVersion", blockArguments[0]);
            block(env, morph0, context, "if", [get(env, context, "valueVersion")], {}, child0, child1);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "liquid-versions", [], {"value": get(env, context, "value"), "name": get(env, context, "helperName"), "use": get(env, context, "use"), "renderWhenFalse": get(env, context, "hasInverse")}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          var child0 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.11.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, content = hooks.content;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
                content(env, morph0, context, "yield");
                return fragment;
              }
            };
          }());
          var child1 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.11.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, content = hooks.content;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
                content(env, morph0, context, "lf-yield-inverse");
                return fragment;
              }
            };
          }());
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 1,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement, blockArguments) {
              var dom = env.dom;
              var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, null);
              dom.insertBoundary(fragment, 0);
              set(env, context, "valueVersion", blockArguments[0]);
              block(env, morph0, context, "if", [get(env, context, "valueVersion")], {}, child0, child1);
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            set(env, context, "container", blockArguments[0]);
            block(env, morph0, context, "liquid-versions", [], {"value": get(env, context, "value"), "notify": get(env, context, "container"), "name": get(env, context, "helperName"), "use": get(env, context, "use"), "renderWhenFalse": get(env, context, "hasInverse")}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "liquid-container", [], {"id": get(env, context, "innerId"), "class": get(env, context, "innerClass")}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "containerless")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/liquid-measured', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/liquid-modal', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"role","dialog");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            var morph0 = dom.createMorphAt(element0,1,1);
            element(env, element0, context, "bind-attr", [], {"class": ":lf-dialog cc.options.dialogClass"});
            element(env, element0, context, "bind-attr", [], {"aria-labelledby": "cc.options.ariaLabelledBy", "aria-label": "cc.options.ariaLabel"});
            inline(env, morph0, context, "view", [get(env, context, "innerView")], {"dismiss": "dismiss"});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, block = hooks.block, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
          dom.insertBoundary(fragment, 0);
          set(env, context, "cc", blockArguments[0]);
          block(env, morph0, context, "lm-container", [], {"action": "escape", "clickAway": "outsideClick"}, child0, null);
          content(env, morph1, context, "lf-overlay");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "liquid-versions", [], {"name": "liquid-modal", "value": get(env, context, "currentContext")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/liquid-outlet', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          set(env, context, "outletStateVersion", blockArguments[0]);
          inline(env, morph0, context, "lf-outlet", [], {"staticState": get(env, context, "outletStateVersion")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "liquid-with", [get(env, context, "outletState")], {"id": get(env, context, "innerId"), "class": get(env, context, "innerClass"), "use": get(env, context, "use"), "name": "liquid-outlet", "containerless": get(env, context, "containerless")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/liquid-spacer', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          content(env, morph0, context, "yield");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "liquid-measured", [], {"measurements": get(env, context, "measurements")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/liquid-versions', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, null);
              dom.insertBoundary(fragment, 0);
              inline(env, morph0, context, "yield", [get(env, context, "version.value")], {});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            block(env, morph0, context, "liquid-child", [], {"version": get(env, context, "version"), "visible": false, "didRender": "childDidRender"}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          set(env, context, "version", blockArguments[0]);
          block(env, morph0, context, "if", [get(env, context, "version.shouldRender")], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "each", [get(env, context, "versions")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/liquid-with', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            set(env, context, "version", blockArguments[0]);
            inline(env, morph0, context, "yield", [get(env, context, "version")], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "liquid-versions", [], {"value": get(env, context, "value"), "use": get(env, context, "use"), "name": get(env, context, "name")}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.0",
            blockParams: 1,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement, blockArguments) {
              var dom = env.dom;
              var hooks = env.hooks, set = hooks.set, get = hooks.get, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, null);
              dom.insertBoundary(fragment, 0);
              set(env, context, "version", blockArguments[0]);
              inline(env, morph0, context, "yield", [get(env, context, "version")], {});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            set(env, context, "container", blockArguments[0]);
            block(env, morph0, context, "liquid-versions", [], {"value": get(env, context, "value"), "notify": get(env, context, "container"), "use": get(env, context, "use"), "name": get(env, context, "name")}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "liquid-container", [], {"id": get(env, context, "innerId"), "class": get(env, context, "innerClass")}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "containerless")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/nw-zoom', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-success btn-rect");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-minus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1]);
          element(env, element1, context, "action", ["zoomOut"], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"disabled","");
          dom.setAttribute(el1,"class","btn btn-success btn-rect");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-minus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-success btn-rect");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-plus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          element(env, element0, context, "action", ["zoomIn"], {});
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"disabled","");
          dom.setAttribute(el1,"class","btn btn-success btn-rect");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-plus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","zoom-label");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("%");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [2]);
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(element2,0,0);
        var morph2 = dom.createMorphAt(fragment,4,4,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "canZoomOut")], {}, child0, child1);
        element(env, element2, context, "action", ["zoomRestore"], {});
        content(env, morph1, context, "zoomValue");
        block(env, morph2, context, "if", [get(env, context, "canZoomIn")], {}, child2, child3);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/pilas-blockly', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"disabled","");
          dom.setAttribute(el1,"class","btn btn-info");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-arrows-h");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Alterar");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element6 = dom.childAt(fragment, [1]);
          element(env, element6, context, "action", ["alternar"], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-warning");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-refresh");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Reiniciar");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element5 = dom.childAt(fragment, [1]);
          element(env, element5, context, "action", ["reiniciar"], {});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-success");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-play");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Ejecutar");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element4 = dom.childAt(fragment, [1]);
          element(env, element4, context, "action", ["ejecutar"], {});
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-warning");
          var el2 = dom.createTextNode("Ver Codigo");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element3 = dom.childAt(fragment, [1]);
          element(env, element3, context, "action", ["ver_codigo"], {});
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"class","btn btn-success");
            var el2 = dom.createTextNode("Guardar");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element2 = dom.childAt(fragment, [1]);
            element(env, element2, context, "action", ["guardar"], {});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"class","btn btn-success");
            var el2 = dom.createTextNode("Crear y Guardar");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element1 = dom.childAt(fragment, [1]);
            element(env, element1, context, "action", ["guardar"], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "if", [get(env, context, "model")], {}, child0, child1);
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-info");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-undo");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Deshacer");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          element(env, element0, context, "action", ["deshacer_cambio"], {});
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-info disabled");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-undo");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Deshacer");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","pilas-blockly-botones");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-info border-right right");
        var el3 = dom.createElement("i");
        dom.setAttribute(el3,"class","fa fa-twitter");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" Compartir en twitter");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","contenedor-blockly");
        dom.setAttribute(el1,"style","height: 300px; width: 500px;");
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element7 = dom.childAt(fragment, [0]);
        var element8 = dom.childAt(element7, [11]);
        var morph0 = dom.createMorphAt(element7,1,1);
        var morph1 = dom.createMorphAt(element7,3,3);
        var morph2 = dom.createMorphAt(element7,5,5);
        var morph3 = dom.createMorphAt(element7,7,7);
        var morph4 = dom.createMorphAt(element7,9,9);
        var morph5 = dom.createMorphAt(fragment,4,4,contextualElement);
        block(env, morph0, context, "if", [get(env, context, "mostrarAlternar")], {}, child0, null);
        block(env, morph1, context, "if", [get(env, context, "ejecutando")], {}, child1, child2);
        block(env, morph2, context, "if", [get(env, context, "mostrarVerCodigo")], {}, child3, null);
        block(env, morph3, context, "if", [get(env, context, "mostrarGuardar")], {}, child4, null);
        block(env, morph4, context, "if", [get(env, context, "cola_deshacer")], {}, child5, child6);
        element(env, element8, context, "action", ["compartir"], {});
        inline(env, morph5, context, "partial", ["compartir"], {});
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/pilas-canvas', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("canvas");
        dom.setAttribute(el1,"id","canvas");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/components/pilas-desafio', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"class","grayscale semi-transparente");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","ribbon right gray semi-transparente");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          var el3 = dom.createTextNode("Muy pronto");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1]);
          var attrMorph0 = dom.createAttrMorph(element1, 'src');
          attribute(env, attrMorph0, element1, "src", concat(env, ["images/desafios/", get(env, context, "nombre"), ".png"]));
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var attrMorph0 = dom.createAttrMorph(element0, 'src');
          attribute(env, attrMorph0, element0, "src", concat(env, ["images/desafios/", get(env, context, "nombre"), ".png"]));
          element(env, element0, context, "action", ["abrir"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","pilas-desafio-titulo");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [2]);
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(element2,0,0);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "deshabilitado")], {}, child0, child1);
        element(env, element2, context, "action", ["abrir"], {});
        content(env, morph1, context, "titulo");
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/desafios/error', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Lo siento, el desafío no se puede cargar.");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/desafios/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Desafíos");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Estos son los desafíos disponibles parar realizar.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,5,5);
        var morph1 = dom.createMorphAt(element0,7,7);
        var morph2 = dom.createMorphAt(element0,9,9);
        var morph3 = dom.createMorphAt(element0,11,11);
        inline(env, morph0, context, "pilas-desafio", [], {"nombre": "alien", "titulo": "El alien y las tuercas", "onSelect": "onSelect"});
        inline(env, morph1, context, "pilas-desafio", [], {"nombre": "ElObreroCopado", "titulo": "El obrero copado", "onSelect": "onSelect"});
        inline(env, morph2, context, "pilas-desafio", [], {"nombre": "vampiro", "titulo": "Pesadillas de vampiro", "deshabilitado": true});
        inline(env, morph3, context, "pilas-desafio", [], {"nombre": "nave", "titulo": "Invasor espacial", "deshabilitado": true});
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/desafios/nombre', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenedor-editor");
        dom.setAttribute(el1,"id","contenedor-editor");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-pilas");
        dom.setAttribute(el2,"id","panel-pilas");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-ayuda");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-derecho");
        dom.setAttribute(el2,"id","panel-derecho");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var morph0 = dom.createMorphAt(element1,1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element2, [1]),0,0);
        var morph2 = dom.createMorphAt(dom.childAt(element2, [3]),0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        inline(env, morph0, context, "pilas-canvas", [], {"actividad": get(env, context, "model.actividad")});
        content(env, morph1, context, "actividad.nombre");
        content(env, morph2, context, "actividad.enunciado");
        inline(env, morph3, context, "pilas-blockly", [], {"actividad": get(env, context, "model.actividad"), "reiniciar": "reiniciar"});
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/editor', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenedor-editor");
        dom.setAttribute(el1,"id","contenedor-editor");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-pilas");
        dom.setAttribute(el2,"id","panel-pilas");
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-ayuda");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-derecho");
        dom.setAttribute(el2,"id","panel-derecho");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, content = hooks.content, get = hooks.get;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var morph0 = dom.createMorphAt(element1,1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [3, 1]),0,0);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        inline(env, morph0, context, "pilas-canvas", [], {"onready": "reiniciar"});
        content(env, morph1, context, "actividad.enunciado");
        inline(env, morph2, context, "pilas-blockly", [], {"model": get(env, context, "model"), "guardar": "guardar", "reiniciar": "reiniciar", "registrarPrimerCodigo": "registrarPrimerCodigo", "actividad": get(env, context, "actividad")});
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/galeria', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","galeria-juego");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","galeria-juego-acciones");
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"class","btn btn-danger btn-xs");
          var el4 = dom.createElement("i");
          dom.setAttribute(el4,"class","fa fa-trash");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","galeria-juego-preview");
          var el3 = dom.createElement("img");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","galeria-juego-titulo");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1, 0]);
          var element2 = dom.childAt(element0, [3]);
          var element3 = dom.childAt(element2, [0]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [5]),0,0);
          element(env, element1, context, "action", ["eliminar", get(env, context, "juego")], {});
          element(env, element2, context, "action", ["abrir", get(env, context, "juego")], {});
          element(env, element3, context, "bindAttr", [], {"src": get(env, context, "juego.imagen")});
          content(env, morph0, context, "juego.nombre");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Parece que no hay ningún juego creado...");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Galería");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element4 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element4,3,3);
        var morph1 = dom.createMorphAt(element4,5,5);
        block(env, morph0, context, "each", [get(env, context, "model")], {"keyword": "juego"}, child0, child1);
        content(env, morph1, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/iframe', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("style");
          var el2 = dom.createTextNode("\n    .contenedor-editor {\n      top: 0px !important;\n    }\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenedor-editor");
        dom.setAttribute(el1,"id","contenedor-editor");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-pilas");
        dom.setAttribute(el2,"id","panel-pilas");
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-ayuda");
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-derecho");
        dom.setAttribute(el2,"id","panel-derecho");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [1]);
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(element1,1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element1, [3, 1]),0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "layout")], {}, child0, child1);
        inline(env, morph1, context, "pilas-canvas", [], {"onready": "reiniciar"});
        content(env, morph2, context, "actividad.enunciado");
        inline(env, morph3, context, "pilas-blockly", [], {"model": get(env, context, "model"), "mostrarAlternar": false, "mostrarGuardar": false, "mostrarVerCodigo": false, "guardar": "guardar", "reiniciar": "reiniciar", "registrarPrimerCodigo": "registrarPrimerCodigo", "actividad": get(env, context, "actividad")});
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Desafíos");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","box");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("img");
        dom.setAttribute(el3,"src","images/main-logo.png");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("br");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n      ¡Hola!, te damos la bienvenida a ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("strong");
        var el5 = dom.createTextNode("pilas-engine-bloques");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(",\n      una herramienta diseñana para a programar utilizando lógica y\n      desafíos.\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n      Ingresá en la sección ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      para comenzar.\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 1, 7]),1,1);
        block(env, morph0, context, "link-to", ["desafios"], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"class","spinner");
        dom.setAttribute(el2,"src","imagenes/spinner.gif");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/preferencia', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"class","btn btn-success");
          var el3 = dom.createTextNode("Guardar");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("table");
          dom.setAttribute(el1,"class","table table-preferencias");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("tr");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("th");
          dom.setAttribute(el3,"class","etiqueta");
          var el4 = dom.createTextNode(" Tu nombre: ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("td");
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [3, 1, 3]),1,1);
          element(env, element1, context, "action", ["guardar"], {});
          inline(env, morph0, context, "input", [], {"type": "text", "value": get(env, context, "model.nombre")});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"disabled","");
          dom.setAttribute(el2,"class","btn btn-info");
          var el3 = dom.createTextNode("Editar");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("table");
          dom.setAttribute(el1,"class","table table-preferencias");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("tr");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("th");
          dom.setAttribute(el3,"class","etiqueta");
          var el4 = dom.createTextNode(" Tu nombre: ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("td");
          var el4 = dom.createTextNode(" sin editar ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [3, 1, 3]),1,1);
          element(env, element0, context, "action", ["editar"], {});
          content(env, morph0, context, "model.nombre");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Preferencias");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Desde esta sección vas a poder configurar\ny describir tus datos personales.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("La información de esta sección servirá para\n  que otros usuarios puedan ver tus códigos\n  publicados.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),7,7);
        block(env, morph0, context, "if", [get(env, context, "edicion")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/test', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenedor-editor");
        dom.setAttribute(el1,"id","contenedor-editor");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-pilas");
        dom.setAttribute(el2,"id","panel-pilas");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-ayuda");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    \n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-derecho");
        dom.setAttribute(el2,"id","panel-derecho");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var morph0 = dom.createMorphAt(element1,1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element2, [1]),0,0);
        var morph2 = dom.createMorphAt(dom.childAt(element2, [3]),0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        inline(env, morph0, context, "pilas-canvas", [], {"actividad": get(env, context, "model.actividad")});
        content(env, morph1, context, "actividad.nombre");
        content(env, morph2, context, "actividad.enunciado");
        inline(env, morph3, context, "pilas-blockly", [], {"actividad": get(env, context, "model.actividad")});
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/templates/tips', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Ejecutá ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("code");
        var el3 = dom.createTextNode("ember watch");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" para activar\nel modo ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("code");
        var el3 = dom.createTextNode("livereload");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(".");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","/tests/index.html");
        var el4 = dom.createTextNode("Run tests");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,4,4,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques/tests/actividades.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('actividades.js should pass jshint', function() { 
    ok(false, 'actividades.js should pass jshint.\nactividades.js: line 1014, col 25, \'EscenaAlien\' is already defined.\nactividades.js: line 1013, col 5, \'__extends\' is not defined.\nactividades.js: line 1072, col 4, \'Base\' is not defined.\n\n3 errors'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadAlien.jshint', function () {

  'use strict';

  module('JSHint - actividades');
  test('actividades/actividadAlien.js should pass jshint', function() { 
    ok(false, 'actividades/actividadAlien.js should pass jshint.\nactividades/actividadAlien.js: line 7, col 25, \'EscenaAlien\' is already defined.\nactividades/actividadAlien.js: line 6, col 5, \'__extends\' is not defined.\nactividades/actividadAlien.js: line 65, col 4, \'Base\' is not defined.\n\n3 errors'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadElObreroCopado.jshint', function () {

  'use strict';

  module('JSHint - actividades');
  test('actividades/actividadElObreroCopado.js should pass jshint', function() { 
    ok(false, 'actividades/actividadElObreroCopado.js should pass jshint.\nactividades/actividadElObreroCopado.js: line 77, col 11, \'ElObreroCopado\' is not defined.\nactividades/actividadElObreroCopado.js: line 2, col 14, \'Sensor\' is defined but never used.\n\n2 errors'); 
  });

});
define('pilas-engine-bloques/tests/actividades/bloques.jshint', function () {

  'use strict';

  module('JSHint - actividades');
  test('actividades/bloques.js should pass jshint', function() { 
    ok(true, 'actividades/bloques.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/components/nw-zoom.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/nw-zoom.js should pass jshint', function() { 
    ok(true, 'components/nw-zoom.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/components/pilas-blockly.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/pilas-blockly.js should pass jshint', function() { 
    ok(false, 'components/pilas-blockly.js should pass jshint.\ncomponents/pilas-blockly.js: line 160, col 18, \'canvas\' is not defined.\ncomponents/pilas-blockly.js: line 61, col 9, \'contenedor\' is defined but never used.\n\n2 errors'); 
  });

});
define('pilas-engine-bloques/tests/components/pilas-canvas.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/pilas-canvas.js should pass jshint', function() { 
    ok(false, 'components/pilas-canvas.js should pass jshint.\ncomponents/pilas-canvas.js: line 10, col 20, \'pilasengine\' is not defined.\n\n1 error'); 
  });

});
define('pilas-engine-bloques/tests/components/pilas-desafio.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/pilas-desafio.js should pass jshint', function() { 
    ok(true, 'components/pilas-desafio.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(false, 'controllers/application.js should pass jshint.\ncontrollers/application.js: line 3, col 5, \'Bootstrap\' is defined but never used.\n\n1 error'); 
  });

});
define('pilas-engine-bloques/tests/controllers/desafios/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/desafios');
  test('controllers/desafios/index.js should pass jshint', function() { 
    ok(true, 'controllers/desafios/index.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/editor.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/editor.js should pass jshint', function() { 
    ok(false, 'controllers/editor.js should pass jshint.\ncontrollers/editor.js: line 74, col 14, \'Bootstrap\' is not defined.\n\n1 error'); 
  });

});
define('pilas-engine-bloques/tests/controllers/galeria.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/galeria.js should pass jshint', function() { 
    ok(true, 'controllers/galeria.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/iframe.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/iframe.js should pass jshint', function() { 
    ok(true, 'controllers/iframe.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/preferencia.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/preferencia.js should pass jshint', function() { 
    ok(true, 'controllers/preferencia.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/helpers/resolver', ['exports', 'ember/resolver', 'pilas-engine-bloques/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('pilas-engine-bloques/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/helpers/start-app', ['exports', 'ember', 'pilas-engine-bloques/app', 'pilas-engine-bloques/router', 'pilas-engine-bloques/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('pilas-engine-bloques/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/helpers/validate-properties', ['exports', 'ember', 'ember-qunit'], function (exports, Ember, ember_qunit) {

  'use strict';

  exports.testValidPropertyValues = testValidPropertyValues;
  exports.testInvalidPropertyValues = testInvalidPropertyValues;

  var run = Ember['default'].run;

  function validateValues(object, propertyName, values, isTestForValid) {
    var promise = null;
    var validatedValues = [];

    values.forEach(function (value) {
      function handleValidation(errors) {
        var hasErrors = object.get("errors." + propertyName + ".firstObject");
        if (hasErrors && !isTestForValid || !hasErrors && isTestForValid) {
          validatedValues.push(value);
        }
      }

      run(object, "set", propertyName, value);

      var objectPromise = null;
      run(function () {
        objectPromise = object.validate().then(handleValidation, handleValidation);
      });

      // Since we are setting the values in a different run loop as we are validating them,
      // we need to chain the promises so that they run sequentially. The wrong value will
      // be validated if the promises execute concurrently
      promise = promise ? promise.then(objectPromise) : objectPromise;
    });

    return promise.then(function () {
      return validatedValues;
    });
  }

  function testPropertyValues(propertyName, values, isTestForValid, context) {
    var validOrInvalid = isTestForValid ? "Valid" : "Invalid";
    var testName = validOrInvalid + " " + propertyName;

    ember_qunit.test(testName, function (assert) {
      var object = this.subject();

      if (context && typeof context === "function") {
        context(object);
      }

      // Use QUnit.dump.parse so null and undefined can be printed as literal 'null' and
      // 'undefined' strings in the assert message.
      var valuesString = QUnit.dump.parse(values).replace(/\n(\s+)?/g, "").replace(/,/g, ", ");
      var assertMessage = "Expected " + propertyName + " to have " + validOrInvalid.toLowerCase() + " values: " + valuesString;

      return validateValues(object, propertyName, values, isTestForValid).then(function (validatedValues) {
        assert.deepEqual(validatedValues, values, assertMessage);
      });
    });
  }
  function testValidPropertyValues(propertyName, values, context) {
    testPropertyValues(propertyName, values, true, context);
  }

  function testInvalidPropertyValues(propertyName, values, context) {
    testPropertyValues(propertyName, values, false, context);
  }

});
define('pilas-engine-bloques/tests/models/galeria.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/galeria.js should pass jshint', function() { 
    ok(true, 'models/galeria.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/models/preferencium.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/preferencium.js should pass jshint', function() { 
    ok(true, 'models/preferencium.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/desafios.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/desafios.js should pass jshint', function() { 
    ok(true, 'routes/desafios.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/desafios/nombre.jshint', function () {

  'use strict';

  module('JSHint - routes/desafios');
  test('routes/desafios/nombre.js should pass jshint', function() { 
    ok(true, 'routes/desafios/nombre.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/editor.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/editor.js should pass jshint', function() { 
    ok(true, 'routes/editor.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/galeria.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/galeria.js should pass jshint', function() { 
    ok(true, 'routes/galeria.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/iframe.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/iframe.js should pass jshint', function() { 
    ok(true, 'routes/iframe.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/preferencia.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/preferencia.js should pass jshint', function() { 
    ok(true, 'routes/preferencia.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/test.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/test.js should pass jshint', function() { 
    ok(true, 'routes/test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/tips.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/tips.js should pass jshint', function() { 
    ok(true, 'routes/tips.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/serializers/application.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/application.js should pass jshint', function() { 
    ok(true, 'serializers/application.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/services/actividades.jshint', function () {

  'use strict';

  module('JSHint - services');
  test('services/actividades.js should pass jshint', function() { 
    ok(false, 'services/actividades.js should pass jshint.\nservices/actividades.js: line 14, col 14, \'CambioDeJSDeBlocky\' is defined but never used.\nservices/actividades.js: line 16, col 62, \'Accion\' is defined but never used.\nservices/actividades.js: line 17, col 6, \'Sensor\' is defined but never used.\nservices/actividades.js: line 40, col 5, \'Repetir\' is defined but never used.\nservices/actividades.js: line 80, col 5, \'Si\' is defined but never used.\nservices/actividades.js: line 108, col 5, \'Sino\' is defined but never used.\nservices/actividades.js: line 142, col 5, \'Hasta\' is defined but never used.\nservices/actividades.js: line 177, col 5, \'Numero\' is defined but never used.\nservices/actividades.js: line 184, col 5, \'OpAritmetica\' is defined but never used.\nservices/actividades.js: line 191, col 5, \'Booleano\' is defined but never used.\nservices/actividades.js: line 198, col 5, \'OpComparacion\' is defined but never used.\nservices/actividades.js: line 205, col 5, \'OpLogica\' is defined but never used.\nservices/actividades.js: line 212, col 5, \'OpNegacion\' is defined but never used.\n\n13 errors'); 
  });

});
define('pilas-engine-bloques/tests/services/browser.jshint', function () {

  'use strict';

  module('JSHint - services');
  test('services/browser.js should pass jshint', function() { 
    ok(false, 'services/browser.js should pass jshint.\nservices/browser.js: line 10, col 28, \'require\' is not defined.\n\n1 error'); 
  });

});
define('pilas-engine-bloques/tests/services/environment.jshint', function () {

  'use strict';

  module('JSHint - services');
  test('services/environment.js should pass jshint', function() { 
    ok(true, 'services/environment.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/services/twitter.jshint', function () {

  'use strict';

  module('JSHint - services');
  test('services/twitter.js should pass jshint', function() { 
    ok(false, 'services/twitter.js should pass jshint.\nservices/twitter.js: line 4, col 7, Redefinition of \'URL\'.\nservices/twitter.js: line 9, col 7, \'$\' is not defined.\nservices/twitter.js: line 21, col 39, \'errorThrown\' is defined but never used.\nservices/twitter.js: line 21, col 31, \'status\' is defined but never used.\n\n4 errors'); 
  });

});
define('pilas-engine-bloques/tests/services/zoom.jshint', function () {

  'use strict';

  module('JSHint - services');
  test('services/zoom.js should pass jshint', function() { 
    ok(true, 'services/zoom.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/test-helper', ['pilas-engine-bloques/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('pilas-engine-bloques/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/transitions.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('transitions.js should pass jshint', function() { 
    ok(true, 'transitions.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/components/pilas-desafio-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("pilas-desafio", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // Creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // Renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });

  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('pilas-engine-bloques/tests/unit/components/pilas-desafio-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/pilas-desafio-test.js should pass jshint', function() { 
    ok(true, 'unit/components/pilas-desafio-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/controllers/desafios-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:desafios", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pilas-engine-bloques/tests/unit/controllers/desafios-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/desafios-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/desafios-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/routes/desafios-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:desafios", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pilas-engine-bloques/tests/unit/routes/desafios-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/desafios-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/desafios-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/routes/desafios.index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:desafios.index", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pilas-engine-bloques/tests/unit/routes/desafios.index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/desafios.index-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/desafios.index-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:index", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pilas-engine-bloques/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/index-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/index-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/routes/test-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:test", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pilas-engine-bloques/tests/unit/routes/test-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/test-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/test-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/routes/tips-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:tips", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pilas-engine-bloques/tests/unit/routes/tips-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/tips-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/tips-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/services/actividades-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("service:actividades", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

  // Specify the other units that are required for this test.
  // needs: ['service:foo']

});
define('pilas-engine-bloques/tests/unit/services/actividades-test.jshint', function () {

  'use strict';

  module('JSHint - unit/services');
  test('unit/services/actividades-test.js should pass jshint', function() { 
    ok(true, 'unit/services/actividades-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/services/browser-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("service:browser", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

  // Specify the other units that are required for this test.
  // needs: ['service:foo']

});
define('pilas-engine-bloques/tests/unit/services/browser-test.jshint', function () {

  'use strict';

  module('JSHint - unit/services');
  test('unit/services/browser-test.js should pass jshint', function() { 
    ok(true, 'unit/services/browser-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/services/environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("service:environment", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

  // Specify the other units that are required for this test.
  // needs: ['service:foo']

});
define('pilas-engine-bloques/tests/unit/services/environment-test.jshint', function () {

  'use strict';

  module('JSHint - unit/services');
  test('unit/services/environment-test.js should pass jshint', function() { 
    ok(true, 'unit/services/environment-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/services/twitter-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("service:twitter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

  // Specify the other units that are required for this test.
  // needs: ['service:foo']

});
define('pilas-engine-bloques/tests/unit/services/twitter-test.jshint', function () {

  'use strict';

  module('JSHint - unit/services');
  test('unit/services/twitter-test.js should pass jshint', function() { 
    ok(true, 'unit/services/twitter-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/services/zoom-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("service:zoom", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

  // Specify the other units that are required for this test.
  // needs: ['service:foo']

});
define('pilas-engine-bloques/tests/unit/services/zoom-test.jshint', function () {

  'use strict';

  module('JSHint - unit/services');
  test('unit/services/zoom-test.js should pass jshint', function() { 
    ok(true, 'unit/services/zoom-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/transitions', ['exports'], function (exports) {

  'use strict';

  exports['default'] = function () {

    /* INDEX */

    this.transition(this.fromRoute("index"), this.toRoute("desafios"), this.use("fade"), this.reverse("fade"));

    this.transition(this.fromRoute("index"), this.toRoute("galeria"), this.use("fade"), this.reverse("fade"));

    this.transition(this.fromRoute("index"), this.toRoute("preferencia"), this.use("fade"), this.reverse("fade"));

    /* DESAFIOS */

    this.transition(this.fromRoute("desafios"), this.toRoute("galeria"), this.use("fade"), this.reverse("fade"));

    this.transition(this.fromRoute("desafios"), this.toRoute("preferencia"), this.use("fade"), this.reverse("fade"));

    /* GALERIA */

    this.transition(this.fromRoute("galeria"), this.toRoute("preferencia"), this.use("fade"), this.reverse("fade"));
  };

});
define('pilas-engine-bloques/transitions/cross-fade', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = crossFade;
  // BEGIN-SNIPPET cross-fade-definition
  function crossFade() {
    var opts = arguments[0] === undefined ? {} : arguments[0];

    liquid_fire.stop(this.oldElement);
    return liquid_fire.Promise.all([liquid_fire.animate(this.oldElement, { opacity: 0 }, opts), liquid_fire.animate(this.newElement, { opacity: [opts.maxOpacity || 1, 0] }, opts)]);
  } // END-SNIPPET

});
define('pilas-engine-bloques/transitions/default', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';



  // This is what we run when no animation is asked for. It just sets
  // the newly-added element to visible (because we always start them
  // out invisible so that transitions can control their initial
  // appearance).
  exports['default'] = defaultTransition;
  function defaultTransition() {
    if (this.newElement) {
      this.newElement.css({ visibility: "" });
    }
    return liquid_fire.Promise.resolve();
  }

});
define('pilas-engine-bloques/transitions/explode', ['exports', 'ember', 'liquid-fire'], function (exports, Ember, liquid_fire) {

  'use strict';



  // Explode is not, by itself, an animation. It exists to pull apart
  // other elements so that each of the pieces can be targeted by
  // animations.

  exports['default'] = explode;

  function explode() {
    var _this = this;

    for (var _len = arguments.length, pieces = Array(_len), _key = 0; _key < _len; _key++) {
      pieces[_key] = arguments[_key];
    }

    var sawBackgroundPiece = false;
    var promises = pieces.map(function (piece) {
      if (piece.matchBy) {
        return matchAndExplode(_this, piece);
      } else if (piece.pick || piece.pickOld || piece.pickNew) {
        return explodePiece(_this, piece);
      } else {
        sawBackgroundPiece = true;
        return runAnimation(_this, piece);
      }
    });
    if (!sawBackgroundPiece) {
      if (this.newElement) {
        this.newElement.css({ visibility: "" });
      }
      if (this.oldElement) {
        this.oldElement.css({ visibility: "hidden" });
      }
    }
    return liquid_fire.Promise.all(promises);
  }

  function explodePiece(context, piece) {
    var childContext = Ember['default'].copy(context);
    var selectors = [piece.pickOld || piece.pick, piece.pickNew || piece.pick];
    var cleanupOld, cleanupNew;

    if (selectors[0] || selectors[1]) {
      cleanupOld = _explodePart(context, "oldElement", childContext, selectors[0]);
      cleanupNew = _explodePart(context, "newElement", childContext, selectors[1]);
      if (!cleanupOld && !cleanupNew) {
        return liquid_fire.Promise.resolve();
      }
    }

    return runAnimation(childContext, piece)["finally"](function () {
      if (cleanupOld) {
        cleanupOld();
      }
      if (cleanupNew) {
        cleanupNew();
      }
    });
  }

  function _explodePart(context, field, childContext, selector) {
    var child, childOffset, width, height, newChild;
    var elt = context[field];
    childContext[field] = null;
    if (elt && selector) {
      child = elt.find(selector);
      if (child.length > 0) {
        childOffset = child.offset();
        width = child.outerWidth();
        height = child.outerHeight();
        newChild = child.clone();

        // Hide the original element
        child.css({ visibility: "hidden" });

        // If the original element's parent was hidden, hide our clone
        // too.
        if (elt.css("visibility") === "hidden") {
          newChild.css({ visibility: "hidden" });
        }
        newChild.appendTo(elt.parent());
        newChild.outerWidth(width);
        newChild.outerHeight(height);
        var newParentOffset = newChild.offsetParent().offset();
        newChild.css({
          position: "absolute",
          top: childOffset.top - newParentOffset.top,
          left: childOffset.left - newParentOffset.left,
          margin: 0
        });

        // Pass the clone to the next animation
        childContext[field] = newChild;
        return function cleanup() {
          newChild.remove();
          child.css({ visibility: "" });
        };
      }
    }
  }

  function animationFor(context, piece) {
    var name, args, func;
    if (!piece.use) {
      throw new Error("every argument to the 'explode' animation must include a followup animation to 'use'");
    }
    if (Ember['default'].isArray(piece.use)) {
      name = piece.use[0];
      args = piece.use.slice(1);
    } else {
      name = piece.use;
      args = [];
    }
    if (typeof name === "function") {
      func = name;
    } else {
      func = context.lookup(name);
    }
    return function () {
      return liquid_fire.Promise.resolve(func.apply(this, args));
    };
  }

  function runAnimation(context, piece) {
    return new liquid_fire.Promise(function (resolve, reject) {
      animationFor(context, piece).apply(context).then(resolve, reject);
    });
  }

  function matchAndExplode(context, piece) {
    if (!context.oldElement) {
      return liquid_fire.Promise.resolve();
    }

    var hits = Ember['default'].A(context.oldElement.find("[" + piece.matchBy + "]").toArray());
    return liquid_fire.Promise.all(hits.map(function (elt) {
      return explodePiece(context, {
        pick: "[" + piece.matchBy + "=" + Ember['default'].$(elt).attr(piece.matchBy) + "]",
        use: piece.use
      });
    }));
  }

});
define('pilas-engine-bloques/transitions/fade', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = fade;

  // BEGIN-SNIPPET fade-definition
  function fade() {
    var _this = this;

    var opts = arguments[0] === undefined ? {} : arguments[0];

    var firstStep;
    var outOpts = opts;
    var fadingElement = findFadingElement(this);

    if (fadingElement) {
      // We still have some older version that is in the process of
      // fading out, so out first step is waiting for it to finish.
      firstStep = liquid_fire.finish(fadingElement, "fade-out");
    } else {
      if (liquid_fire.isAnimating(this.oldElement, "fade-in")) {
        // if the previous view is partially faded in, scale its
        // fade-out duration appropriately.
        outOpts = { duration: liquid_fire.timeSpent(this.oldElement, "fade-in") };
      }
      liquid_fire.stop(this.oldElement);
      firstStep = liquid_fire.animate(this.oldElement, { opacity: 0 }, outOpts, "fade-out");
    }
    return firstStep.then(function () {
      return liquid_fire.animate(_this.newElement, { opacity: [opts.maxOpacity || 1, 0] }, opts, "fade-in");
    });
  }

  function findFadingElement(context) {
    for (var i = 0; i < context.older.length; i++) {
      var entry = context.older[i];
      if (liquid_fire.isAnimating(entry.element, "fade-out")) {
        return entry.element;
      }
    }
    if (liquid_fire.isAnimating(context.oldElement, "fade-out")) {
      return context.oldElement;
    }
  }
  // END-SNIPPET

});
define('pilas-engine-bloques/transitions/flex-grow', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = flexGrow;
  function flexGrow(opts) {
    liquid_fire.stop(this.oldElement);
    return liquid_fire.Promise.all([liquid_fire.animate(this.oldElement, { "flex-grow": 0 }, opts), liquid_fire.animate(this.newElement, { "flex-grow": [1, 0] }, opts)]);
  }

});
define('pilas-engine-bloques/transitions/fly-to', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';



  exports['default'] = flyTo;
  function flyTo() {
    var _this = this;

    var opts = arguments[0] === undefined ? {} : arguments[0];

    if (!this.newElement) {
      return liquid_fire.Promise.resolve();
    } else if (!this.oldElement) {
      this.newElement.css({ visibility: "" });
      return liquid_fire.Promise.resolve();
    }

    var oldOffset = this.oldElement.offset();
    var newOffset = this.newElement.offset();

    var motion = {
      translateX: newOffset.left - oldOffset.left,
      translateY: newOffset.top - oldOffset.top,
      outerWidth: this.newElement.outerWidth(),
      outerHeight: this.newElement.outerHeight()
    };

    this.newElement.css({ visibility: "hidden" });
    return liquid_fire.animate(this.oldElement, motion, opts).then(function () {
      _this.newElement.css({ visibility: "" });
    });
  }

});
define('pilas-engine-bloques/transitions/move-over', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';



  exports['default'] = moveOver;

  function moveOver(dimension, direction, opts) {
    var _this = this;

    var oldParams = {},
        newParams = {},
        firstStep,
        property,
        measure;

    if (dimension.toLowerCase() === "x") {
      property = "translateX";
      measure = "width";
    } else {
      property = "translateY";
      measure = "height";
    }

    if (liquid_fire.isAnimating(this.oldElement, "moving-in")) {
      firstStep = liquid_fire.finish(this.oldElement, "moving-in");
    } else {
      liquid_fire.stop(this.oldElement);
      firstStep = liquid_fire.Promise.resolve();
    }

    return firstStep.then(function () {
      var bigger = biggestSize(_this, measure);
      oldParams[property] = bigger * direction + "px";
      newParams[property] = ["0px", -1 * bigger * direction + "px"];

      return liquid_fire.Promise.all([liquid_fire.animate(_this.oldElement, oldParams, opts), liquid_fire.animate(_this.newElement, newParams, opts, "moving-in")]);
    });
  }

  function biggestSize(context, dimension) {
    var sizes = [];
    if (context.newElement) {
      sizes.push(parseInt(context.newElement.css(dimension), 10));
      sizes.push(parseInt(context.newElement.parent().css(dimension), 10));
    }
    if (context.oldElement) {
      sizes.push(parseInt(context.oldElement.css(dimension), 10));
      sizes.push(parseInt(context.oldElement.parent().css(dimension), 10));
    }
    return Math.max.apply(null, sizes);
  }

});
define('pilas-engine-bloques/transitions/scale', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';



  exports['default'] = scale;
  function scale() {
    var _this = this;

    var opts = arguments[0] === undefined ? {} : arguments[0];

    return liquid_fire.animate(this.oldElement, { scale: [0.2, 1] }, opts).then(function () {
      return liquid_fire.animate(_this.newElement, { scale: [1, 0.2] }, opts);
    });
  }

});
define('pilas-engine-bloques/transitions/scroll-then', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = function (nextTransitionName, options) {
    var _this = this;

    for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    Ember['default'].assert("You must provide a transition name as the first argument to scrollThen. Example: this.use('scrollThen', 'toLeft')", "string" === typeof nextTransitionName);

    var el = document.getElementsByTagName("html");
    var nextTransition = this.lookup(nextTransitionName);
    if (!options) {
      options = {};
    }

    Ember['default'].assert("The second argument to scrollThen is passed to Velocity's scroll function and must be an object", "object" === typeof options);

    // set scroll options via: this.use('scrollThen', 'ToLeft', {easing: 'spring'})
    options = Ember['default'].merge({ duration: 500, offset: 0 }, options);

    // additional args can be passed through after the scroll options object
    // like so: this.use('scrollThen', 'moveOver', {duration: 100}, 'x', -1);

    return window.$.Velocity(el, "scroll", options).then(function () {
      nextTransition.apply(_this, rest);
    });
  };

});
define('pilas-engine-bloques/transitions/to-down', ['exports', 'pilas-engine-bloques/transitions/move-over'], function (exports, moveOver) {

  'use strict';

  exports['default'] = function (opts) {
    return moveOver['default'].call(this, "y", 1, opts);
  };

});
define('pilas-engine-bloques/transitions/to-left', ['exports', 'pilas-engine-bloques/transitions/move-over'], function (exports, moveOver) {

  'use strict';

  exports['default'] = function (opts) {
    return moveOver['default'].call(this, "x", -1, opts);
  };

});
define('pilas-engine-bloques/transitions/to-right', ['exports', 'pilas-engine-bloques/transitions/move-over'], function (exports, moveOver) {

  'use strict';

  exports['default'] = function (opts) {
    return moveOver['default'].call(this, "x", 1, opts);
  };

});
define('pilas-engine-bloques/transitions/to-up', ['exports', 'pilas-engine-bloques/transitions/move-over'], function (exports, moveOver) {

  'use strict';

  exports['default'] = function (opts) {
    return moveOver['default'].call(this, "y", -1, opts);
  };

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('pilas-engine-bloques/config/environment', ['ember'], function(Ember) {
  var prefix = 'pilas-engine-bloques';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("pilas-engine-bloques/tests/test-helper");
} else {
  require("pilas-engine-bloques/app")["default"].create({"name":"pilas-engine-bloques","version":"0.4.0"});
}

/* jshint ignore:end */
//# sourceMappingURL=pilas-engine-bloques.map