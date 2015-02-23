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
    var toolbox = this.$().find('#toolbox')[0];

    Blockly.inject(contenedor, {
      collapse: false,
      duplicate: false,
      trashOnlyDelete: true,
      disable: false,
      comments: false,
      defsOnly: true,
      defsNames: ['al_empezar_a_ejecutar', 'procedures_defnoreturn', 'procedures_defreturn'],
      path: './libs/blockly/',
      toolbox: toolbox,
    });

    // Agrego el bloque 'al empezar a ejecutar' al momento de iniciar Blockly
    var main_program_block_def = Blockly.Block.obtain(Blockly.mainWorkspace, 'al_empezar_a_ejecutar');
    main_program_block_def.initSvg();
    Blockly.getMainWorkspace().render();

    this.cargar_lenguaje();
    this.cargar_codigo_desde_el_modelo();
  }.on('didInsertElement'),

  cargar_lenguaje: function() {
    Blockly.updateToolbox(this.get('actividad').construirLenguaje());
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
