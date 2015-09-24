/*jshint unused:false*/

import Ember from 'ember';
import bloques from 'pilas-engine-bloques/actividades/bloques';

import actividadAlien from 'pilas-engine-bloques/actividades/actividadAlien';
import actividadLaEleccionDelMono from 'pilas-engine-bloques/actividades/actividadLaEleccionDelMono';
import actividadElMonoYLasBananas from 'pilas-engine-bloques/actividades/actividadElMonoYLasBananas';
import actividadLightbotEnScratch from 'pilas-engine-bloques/actividades/actividadLightbotEnScratch';
import actividadFutbolRobots from 'pilas-engine-bloques/actividades/actividadFutbolRobots';
import actividadElPlanetaDeNano from 'pilas-engine-bloques/actividades/actividadElPlanetaDeNano';
import actividadAlienTocaBoton from 'pilas-engine-bloques/actividades/actividadAlienTocaBoton';
import actividadLightbotRecargado from 'pilas-engine-bloques/actividades/actividadLightbotRecargado';
import actividadSuperTito1 from 'pilas-engine-bloques/actividades/actividadSuperTito1';
import actividadSuperTito2 from 'pilas-engine-bloques/actividades/actividadSuperTito2';
//import actividadElRecolectorDeEstrellas from 'pilas-engine-bloques/actividades/actividadElRecolectorDeEstrellas';
//import actividadMariaLaComeSandias from 'pilas-engine-bloques/actividades/actividadMariaLaComeSandias';
//import actividadAlimentandoALosPeces from 'pilas-engine-bloques/actividades/actividadAlimentandoALosPeces';
//import actividadInstalandoJuegos from 'pilas-engine-bloques/actividades/actividadInstalandoJuegos';
//import actividadLaGranAventuraDelMarEncantado from 'pilas-engine-bloques/actividades/actividadLaGranAventuraDelMarEncantado ;
//import actividadReparandoLaNave from 'pilas-engine-bloques/actividades/actividadReparandoLaNave';
//import actividadLaberintoCorto from 'pilas-engine-bloques/actividades/actividadLaberintoCorto';
//import actividadTresNaranjas 'pilas-engine-bloques/actividades/actividadTresNaranjas';

//import actividadLaberintoLargo 'pilas-engine-bloques/actividades/actividadLaberintoLargo';
//import actividadSuperLightbot2 'pilas-engine-bloques/actividades/actividadSuperLightbot2';
//import actividadLaberintoConQueso 'pilas-engine-bloques/actividades/actividadLaberintoConQueso';
//import actividadElDetectiveChaparro 'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';
//import actividadPrendiendoLasCompus 'pilas-engine-bloques/actividades/actividadPrendiendoLasCompus';
//import actividadElDetectiveChaparro 'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';
//import actividadElMonoQueSabeContar 'pilas-engine-bloques/actividades/actividadElMonoQueSabeContar';
//import actividadElMonoCuentaDeNuevo'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';
//import actividadElDetectiveChaparro 'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';




Blockly.Blocks.primitivas = { COLOUR: '#4a6cd4' };
Blockly.Blocks.sensores = { COLOUR: '#4a6cd4' };
Blockly.Blocks.eventos = { COLOUR: '#4a6cd4' };

/* ============================================== */

var {Bloque, CambioDeJSDeBlocky, VariableGet,
     VariableSet, VariableLocalGet, VariableLocalSet, Procedimiento,
     Funcion, CallNoReturn, CallReturn, ParamGet, AlEmpezar, Accion,
     Sensor} = bloques;






/* ============================================== */

var EstructuraDeControl = Bloque.extend({

  block_init(block) {
    this._super(block);
    block.setColour(Blockly.Blocks.loops.COLOUR);
    block.setInputsInline(true);
    block.setPreviousStatement(true);
    block.setNextStatement(true);
  }

});

/* ============================================== */

var Repetir = EstructuraDeControl.extend({

  init() {
    this._super();
    this.set('id', 'repetir');
  },

  block_init(block) {
    this._super(block);
    block.appendValueInput('count')
        .setCheck('Number')
        .appendField('repetir');
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
        .appendField('si');
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
        .appendField('si');
    block.appendStatementInput('block1');
    block.appendDummyInput()
        .appendField('sino');
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
        .appendField('repetir hasta que');
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

var ExpresionDeBlockly = Bloque.extend({

  registrar_en_blockly() {
    // pisado porque ya viene con blockly
    // ni tampoco quiero modificar el javascript
  }

});

var Numero = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'math_number');
  },
});

var OpAritmetica = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'math_arithmetic');
  },
});

var Booleano = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'logic_boolean');
  },
});

var OpComparacion = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'logic_compare');
  },
});

var OpLogica = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'logic_operation');
  },
});

var OpNegacion = ExpresionDeBlockly.extend({
  init() {
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
   build() {
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
   build() {
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

  init() {
    this.set('categorias', []);
    this.set('bloques', {});
  },

  agregar(c, bs) {
    if(bs !== undefined) {
      this.categoria(c);
      bs.forEach(function (b) {
        this.bloque(c, b);
      }.bind(this));
    }
  },

  categoria(c) {
    this.get('categorias').pushObject(c);
    var bs = this.get('bloques');
    bs[c] = [];
    this.set('bloques', bs);
  },

  bloque(c, b) {
    var block = this.definir_bloque(b);
    this.get('bloques')[c].pushObject(block);
  },

  definir_bloque(b) {
    var block = b.create();
    block.registrar_en_blockly();
    return block;
  },

  build() {
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

  _build_categoria(categoria) {
    var str_category = '';

    str_category += '<category name="x">\n'.replace('x', categoria);

    this.get('bloques')[categoria].forEach(function(b) {
       str_category += b.build();
    });

    str_category += '</category>\n';

    return str_category;
  },

  _build_procedures() {
    return '<category name="Subtareas" custom="PROCEDURE"></category>';
  },

  _build_variables() {
    return '<category name="Variables" custom="VARIABLE"></category>';
  }

});












/* ============================================== */

/**
  Modelo de actividad
**/
var Actividad = Ember.Object.extend({
  init() {
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

  iniciarEscena() {
    var Esc = this.get('escena');
    var esc_instance = new Esc();
    this.set('escena_instanciada', esc_instance);
    pilas.mundo.gestor_escenas.cambiar_escena(esc_instance);
  },

  obtenerLenguaje() {
    var act = this.get('actividad');
    var leng = Lenguaje.create();

    var bloques_para_toolbox = {
      Acciones: 'acciones',
      Sensores: 'sensores',
      Control: 'control',
      Expresiones: 'expresiones',
      Variables: 'variables',
      Subtareas: 'subtareas'
    };

    // Itera por todos los bloques y los agrega al toolbox solamente
    // si tienen piezas para mostrar.
    for (let key in bloques_para_toolbox) {
      let propiedad = bloques_para_toolbox[key];

      if (act[propiedad].length > 0) {
        leng.agregar(key, act[propiedad]);
      }
    }

    return leng.build();
  },

  bloques_iniciales() {
    return [AlEmpezar];
  },

  crear_bloques_iniciales() {
    this.bloques_iniciales().forEach(function(b){
      b.create().instanciar_para_workspace();
    });
  },

  pisar_bloques_blockly() {
    CallReturn.create().registrar_en_blockly();
    CallNoReturn.create().registrar_en_blockly();
    ParamGet.create().registrar_en_blockly();
    VariableGet.create().registrar_en_blockly();
    VariableSet.create().registrar_en_blockly();
    VariableLocalGet.create().registrar_en_blockly();
    VariableLocalSet.create().registrar_en_blockly();
  },

  usa_procedimientos() {
    return this.get('actividad').subtareas.indexOf(Procedimiento) > -1;

  },

  usa_funciones() {
    return this.get('actividad').subtareas.indexOf(Funcion) > -1;
  },

  iniciarBlockly(contenedor) {
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

  generarCodigo() {
    // variable global con la que se accede al receptor del programa
    window.receptor = this.get('escena_instanciada').automata;
    var comienzo = 'var programa = new pilas.comportamientos.ConstructorDePrograma();\n\n';
    var code = Blockly.JavaScript.workspaceToCode();
    return comienzo + code;
  },

  generarCodigoXML() {
    var code = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    return code;
  },

  // Scratch style colours
  setColours() {
    Blockly.Blocks.primitivas.COLOUR = '#4a6cd4';
    Blockly.Blocks.sensores.COLOUR = '#2ca5e2';
    Blockly.Blocks.eventos.COLOUR = '#00a65a'; // == boton ejecutar
    Blockly.Blocks.math.COLOUR = '#49930e';
    Blockly.Blocks.logic.COLOUR = '#5cb712';
    Blockly.Blocks.loops.COLOUR = '#ee7d16';

    Blockly.Blocks.procedures.COLOUR = '#6C52EB';
    //Blockly.Blocks.procedures.vars.COLOUR = '#8a55d7';
    //Blockly.Blocks.procedures.params.COLOUR = '#6C52EB';


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

  obtener_codigo_en_texto() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
    return Blockly.Xml.domToText(xml);
  },

});


export default Ember.Service.extend({
  obtenerPorNombre(nombreActividad) {

    let actividades = {
      alien: actividadAlien,
      AlienTocaBoton: actividadAlienTocaBoton,
      LaEleccionDelMono: actividadLaEleccionDelMono,
      ElMonoYLasBananas: actividadElMonoYLasBananas,
      LightbotEnScratch: actividadLightbotEnScratch,
      FutbolRobots: actividadFutbolRobots,
      //ElPlanetaDeNano: actividadElPlanetaDeNano
      LightbotRecargado : actividadLightbotRecargado,
      SuperTito1: actividadSuperTito1,
      SuperTito2: actividadSuperTito2,
      /*MariaLaComeSandias: actividadMariaLaComeSandias
      ElRecolectorDeEstrellas: actividadElRecolectorDeEstrellas
      AlimentandoALosPeces: actividadAlimentandoALosPeces
      InstalandoJuegos:InstalandoJuegos
      LaGranAventuraDelMarEncantado: actividadLaGranAventuraDelMarEncantado
      ReparandoLaNave: actividadReparandoLaNave
      LaberintoCorto: actividadLaberintoCorto
      TresNaranjas: actividadTresNaranjas*/
    };

    var actividad = actividades[nombreActividad];

    if (!actividad) {
      return null;
    }

    return Actividad.create({actividad});
  }
});
