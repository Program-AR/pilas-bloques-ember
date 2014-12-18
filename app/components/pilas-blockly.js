import Ember from 'ember';

var Blockly = window.Blockly;

export default Ember.Component.extend({
  didInsertElement: function() {
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
        eval(code);
      } catch (e) {
        alert(e);
      }
    },
    reiniciar: function() {
      this.sendAction('reiniciar');
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
      path: './libs/blockly/',
      toolbox: toolbox,
    });

    this.cargar_escenario(this.escenario);

  }.on('didInsertElement'),

  crear_dom_para_bloques: function (lista_de_bloques) {
    var str_toolbox = '';
    str_toolbox += '<xml>';

    for (var x in lista_de_bloques) {
      str_toolbox += '<category name="x">\n'.replace('x', x);

      for (var i=0; i<lista_de_bloques[x].length; i++) {
        str_toolbox += '  <block type="TIPO"></block>'.replace("TIPO", lista_de_bloques[x][i]);
      }

      str_toolbox += '</category>\n';
    }

    str_toolbox += '</xml>';
    //console.log(str_toolbox);
    return str_toolbox;
  },

  definir_bloques: function(bloques) {
    Blockly.updateToolbox(this.crear_dom_para_bloques(bloques));
  },

  cargar_escenario: function(escenario) {
    var escenarios = {};

    escenarios.alien_laberinto = function() {
      this.definir_bloques({
        Alien: [ 'alien-ir_derecha', 'alien-ir_izquierda',
                  'alien-ir_arriba', 'alien-ir_abajo',
                  'alien-recoger',
                ],
      });

    }.bind(this);


    if (escenario in escenarios) {
      escenarios[escenario].call(this);
    }
    else {
      throw new Error("No se puede cargar el escenario {{ESCENARIO}}, al parecer no está declarado en pilas-blockly.js".replace("{{ESCENARIO}}", escenario));
    }


  }
});
