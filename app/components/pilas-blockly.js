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
    Blockly.HSV_SATURATION = 1;
    Blockly.HSV_VALUE = 0.5;
    Blockly.Blocks.logic.HUE = 210;
    Blockly.Blocks.loops.HUE = 56;
    Blockly.Blocks.math.HUE = 230;
    Blockly.Blocks.procedures.HUE = 270;
    Blockly.Blocks.procedures.params.HUE = 270;
    Blockly.Blocks.variables.HUE = 330;
    Blockly.Blocks.texts.HUE = 160;
    Blockly.Blocks.lists.HUE = 260;
    Blockly.Blocks.colour.HUE = 20;
    Blockly.Blocks.primitivas.HUE = 250;
    Blockly.Blocks.sensores.HUE = 250;
    Blockly.Blocks.eventos.HUE = 250;
    Blockly.makeColour = function(hue) {
      return goog.color.hslToHex(hue, Blockly.HSV_SATURATION,
          Blockly.HSV_VALUE);
    };
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
