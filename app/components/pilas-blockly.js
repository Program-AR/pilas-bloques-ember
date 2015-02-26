import Ember from 'ember';

export default Ember.Component.extend({
  ejecutando: false,

  didInsertElement: function() {
    window.forzar_redimensionado();
    this.sendAction('redimensionar');
  },

  actions: {
    ejecutar: function() {
      window.LoopTrap = 1000;
      this.sendAction('reiniciar');
      Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';

      var code = Blockly.JavaScript.workspaceToCode();
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

      try {
        this.set('ejecutando', true);
        eval(code);
        this.sendAction('parar');
      } catch (e) {
        alert(e);
      }
    },
    reiniciar: function() {
      this.set('ejecutando', false);
      this.sendAction('reiniciar');
    },
    guardar: function() {
      var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      var codigo_xml = Blockly.Xml.domToText(xml);

      this.sendAction('guardar', codigo_xml);
    },
    alternar: function() {
      //this.sendAction('redimensionar');
      console.log(this.controllerFor('application'));
      //.sendAction('redimensionar');
    },
    ver_codigo: function() {
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      var code = Blockly.JavaScript.workspaceToCode();
      alert(code);
    }

  },

  iniciarBlockly: function() {
    var contenedor = this.$().find('#contenedor-blockly')[0];
    var actividad = this.get('actividad');

    this.setScratchStyle();

    Blockly.inject(contenedor, {
      collapse: false,
      duplicate: actividad.get('puedeDuplicar'),
      trashOnlyDelete: true,
      disable: actividad.get('puedeDesactivar'),
      comments: actividad.get('puedeComentar'),
      defsOnly: true,
      rgbColours: true,
      defsNames: ['al_empezar_a_ejecutar', 'procedures_defnoreturn', 'procedures_defreturn'],
      path: './libs/blockly/',
      toolbox: Blockly.Xml.textToDom(this.get('actividad').construirLenguaje()),
    });

    // Agrego el bloque 'al empezar a ejecutar' al momento de iniciar Blockly
    var main_program_block_def = Blockly.Xml.textToDom('<xml> <block type="al_empezar_a_ejecutar"> </block> </xml>');
    Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), main_program_block_def);

    this.cargar_codigo_desde_el_modelo();
  }.on('didInsertElement'),

  // setea los colores de blockly para ser similares a los de Scratch
  setScratchStyle: function() {


    Blockly.Blocks.primitivas.COLOUR = '#4a6cd4';
    Blockly.Blocks.sensores.COLOUR = '#2ca5e2';
    Blockly.Blocks.eventos.COLOUR = '#00a65a'; // del boton ejecutar
    Blockly.Blocks.math.COLOUR = '#49930e';
    Blockly.Blocks.logic.COLOUR = '#5cb712';
    Blockly.Blocks.loops.COLOUR = '#ee7d16';

    Blockly.Blocks.procedures.COLOUR = '#8a55d7';
    Blockly.Blocks.procedures.params.COLOUR = '#8a55d7';
    Blockly.Blocks.variables.COLOUR = '#cc5b22';

    Blockly.Blocks.texts.COLOUR = '#4a6cd4';
    Blockly.Blocks.lists.COLOUR = '#cc5b22';
    Blockly.Blocks.colour.COLOUR = '#4a6cd4';

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

  cargar_codigo_desde_el_modelo: function() {
    if (this.get('model')) {
      var modelo = this.get('model');
      var codigo = modelo.get('codigo');

      var xml = Blockly.Xml.textToDom(codigo);
      Blockly.mainWorkspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml);
    }
  }
});
