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
    this.set('id', actividad.id);
    this.set('enunciado', actividad.enunciado);
    this.set('escena', actividad.escena);
    this.set('puedeComentar', actividad.puedeComentar);
    this.set('puedeDesactivar', actividad.puedeDesactivar);
    this.set('puedeDuplicar', actividad.puedeDuplicar);
    this.set('esDeExploracion', actividad.esDeExploracion);
    this.setColours();
    this.pisar_bloques_blockly();
  },

/*
  iniciarEscena() {
    var Esc = this.get('escena');
    var esc_instance = new Esc();
    this.set('escena_instanciada', esc_instance);
    pilas.mundo.gestor_escenas.cambiar_escena(esc_instance);
  },
  */

  obtenerLenguaje() {
    var act = this.get('actividad');
    var leng = Lenguaje.create();

    act.bloques.forEach(claseBloque => leng.agregarBloque(claseBloque));

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
    return this.get('actividad').bloques.indexOf(Procedimiento) > -1;

  },

  usa_funciones() {
    return this.get('actividad').bloques.indexOf(Funcion) > -1;
  },

  iniciarBlockly(contenedor) {

    Blockly.inject(contenedor, {
      collapse: false,
      duplicate: this.get('puedeDuplicar'),
      trashOnlyDelete: true,
      disable: this.get('puedeDesactivar'),
      comments: this.get('puedeComentar'),
      defsOnly: true,
      def_procedures: this.usa_procedimientos(),
      def_functions: this.usa_funciones(),
      globalVariables: false,
      oneReturnOnly: true,
      defsNames: ['al_empezar_a_ejecutar', 'procedures_defnoreturn', 'procedures_defreturn'],
      path: './libs/blockly/',
      toolbox: Blockly.Xml.textToDom(this.obtenerLenguaje()),
    });

    this.crear_bloques_iniciales();

    var event = new Event('terminaCargaInicial');
    window.dispatchEvent(event);
  },

  generarCodigo() {
    // variable global con la que se accede al receptor del programa
    //window.receptor = this.get('escena_instanciada').automata;

    var comienzo = [
      'var receptor = pilas.escena_actual().automata;                      // generarCodigo()',
      'var programa = new pilas.comportamientos.ConstructorDePrograma();   // generarCodigo()',
      '', '']
      .join('\n');

    var code = Blockly.JavaScript.workspaceToCode();
    return comienzo + code;
  },

  generarCodigoXML() {
    var code = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    return code;
  },

  generarCodigoXMLComoString() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codigo = this.generarCodigoXML();

    function xml2string(node) {
      if (typeof(XMLSerializer) !== 'undefined') {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
      } else if (node.xml) {
        return node.xml;
      }
    }

    return xml2string(codigo);
  },

  cargarCodigoDesdeStringXML(codigo) {
    var workspace = Blockly.getMainWorkspace();
    workspace.clear();
    var xml = Blockly.Xml.textToDom(codigo);
    Blockly.Xml.domToWorkspace(workspace, xml);
  },

  debeFelicitarse(){
    return (!this.get('esDeExploracion'));
  },

  // Scratch style colours
  setColours() {
    /*global goog */
    Blockly.Blocks.primitivas.COLOUR =  goog.color.hexToHsv('#4a6cd4');
    Blockly.Blocks.sensores.COLOUR = goog.color.hexToHsv('#2ca5e2');
    Blockly.Blocks.eventos.COLOUR = goog.color.hexToHsv('#00a65a'); // == boton ejecutar
    Blockly.Blocks.math.COLOUR = goog.color.hexToHsv('#49930e');
    Blockly.Blocks.logic.COLOUR = goog.color.hexToHsv('#5cb712');
    Blockly.Blocks.loops.COLOUR = goog.color.hexToHsv('#ee7d16');

    Blockly.Blocks.procedures.COLOUR = goog.color.hexToHsv('#6C52EB');
    //Blockly.Blocks.procedures.vars.COLOUR = '#8a55d7';
    //Blockly.Blocks.procedures.params.COLOUR = '#6C52EB';


    Blockly.Blocks.variables.COLOUR = goog.color.hexToHsv('#cc5b22');

    Blockly.Blocks.texts.COLOUR = goog.color.hexToHsv('#4a6cd4');
    Blockly.Blocks.lists.COLOUR = goog.color.hexToHsv('#cc5b22');
    Blockly.Blocks.colour.COLOUR = goog.color.hexToHsv('#4a6cd4');

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
