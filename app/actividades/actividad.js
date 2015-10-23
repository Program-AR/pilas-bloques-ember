import Ember from 'ember';
import bloques from 'pilas-engine-bloques/actividades/bloques';
import Lenguaje from 'pilas-engine-bloques/actividades/lenguaje';

var {/*Bloque, CambioDeJSDeBlocky,*/ VariableGet,
     VariableSet, VariableLocalGet, VariableLocalSet, Procedimiento,
     Funcion, CallNoReturn, CallReturn, ParamGet, AlEmpezar, /*Accion,
     Sensor*/} = bloques;

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

    var event = new Event('terminaCargaInicial');
    window.dispatchEvent(event);
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

  cargarCodigoDesdeStringXML(codigo) {
    var workspace = Blockly.getMainWorkspace();
    workspace.clear();
    var xml = Blockly.Xml.textToDom(codigo);
    Blockly.Xml.domToWorkspace(workspace, xml);
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


export default Actividad;
