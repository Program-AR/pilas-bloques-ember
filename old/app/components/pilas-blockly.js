import Ember from 'ember';

export default Ember.Component.extend({
  ejecutando: false,
  cola_deshacer: [],

  didInsertElement: function() {
    window.forzar_redimensionado();
    this.sendAction('redimensionar');
  },

  observarCambiosEnBlocky: function() {
    var f = this.almacenar_cambio.bind(this);
    var d = Blockly.addChangeListener(f);
    this.set('data_observar_blockly', d);
  },

  noMirarCambiosEnBlockly: function() {
    if(this.get('data_observar_blockly')) {
      Blockly.removeChangeListener(this.get('data_observar_blockly'));
    }
  },

  actions: {
    ejecutar: function() {
      window.LoopTrap = 1000;
      this.sendAction('reiniciar');
      Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';

      var code = this.get('actividad').generarCodigo();
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
      this.sendAction('guardar');
    },
    alternar: function() {
      //this.sendAction('redimensionar');
      console.log(this.controllerFor('application'));
      //.sendAction('redimensionar');
    },
    ver_codigo: function() {
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      var code = this.get('actividad').generarCodigo();
      alert(code);
    },
    deshacer_cambio: function() {
      this.noMirarCambiosEnBlockly();
      this.get('cola_deshacer').popObject();
      var c =  this.get('cola_deshacer').popObject();
      if(c) {
        console.log("deshacer");
        this.restaurar_codigo(c);
      }
      this.observarCambiosEnBlocky();
    },
  },

  almacenar_cambio: function() {
    this.get('cola_deshacer').pushObject(this.obtener_codigo_en_texto());
    console.log("guardar");
  },

  restaurar_codigo: function(codigo) {
    var xml = Blockly.Xml.textToDom(codigo);
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml);
  },

  obtener_codigo_en_texto: function() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
    return Blockly.Xml.domToText(xml);
  },

  iniciarBlockly: function() {
    var contenedor = this.$().find('#contenedor-blockly')[0];
    this.get('actividad').iniciarBlockly(contenedor);
    this.set('cola_deshacer', []);
    this.cargar_codigo_desde_el_modelo();
    this.observarCambiosEnBlocky();
  }.on('didInsertElement'),

  cargar_codigo_desde_el_modelo: function() {
    if (this.get('model')) {
      var modelo = this.get('model');
      var codigo = modelo.get('codigo');
      this.restaurar_codigo(codigo);
    }
    this.sendAction('registrarPrimerCodigo');
  }
});
