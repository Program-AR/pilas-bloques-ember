import Ember from 'ember';

var Blockly = window.Blockly;

/*
   Modelo que permite definir el lenguaje
   de una actividad
*/

var BloqueCategoria = Ember.Object.extend({
   init: function() {
      this.set('bloques', []);
   },
      
   agregar_simple: function(blockType) {
     this.get('bloques').pushObject(Bloque.create({
       tipo: blockType
     }));
   },

   agregar_con_params: function(blockType, params) {
    var nuevo_bloque = Bloque.create({
       tipo: blockType
    });

    nuevo_bloque.agregar(params);
    
    this.get('bloques').pushObject(nuevo_bloque);
   },
   
   borrar: function(blockType) {
     this.get('bloques').forEach(function (item) {
       if(item.get('tipo') === blockType) {
           this.get('bloques').removeObject(item);
       }
     });
   },

   build: function() {
     var str_category = '';
     
     str_category += '<category name="x">\n'.replace("x", this.get('nombre'));
     
     this.get('bloques').forEach(function(item) {
         str_category += item.build();
     });
     
     str_category += '</category>\n';
     
     return str_category;
   }
});

var BloqueCategoriaVariables = Ember.Object.extend({
    build: function() {
        return '<category name="Variables" custom="VARIABLE"></category>';
    }
});

var BloqueCategoriaSubtareas = Ember.Object.extend({
    build: function() {
        return '<category name="Subtareas" custom="PROCEDURE"></category>';
    }
});

var Bloque = Ember.Object.extend({
   init: function() {
      this.set('parametros', []);
   },
   
   agregar: function(params) {
      var yo = this;
      params.forEach( function(item) {
         yo.get('parametros').pushObject(item);
      });
   },
   
   build: function() {
     var str_block = '';
     str_block += '<block type="TIPO">'.replace("TIPO", this.get('tipo'));
     
     this.get('parametros').forEach(function(item) {
         str_block += item.build();
     });
     
     str_block += '</block>';
     return str_block;
   }
});

var ParamCampo = Ember.Object.extend({
   build: function() {
     var str_block = '';
     str_block += '<field name="NOMBRE">'.replace("NOMBRE", this.get('nombre_valor'));
     str_block += this.get('valor');
     str_block += '</field>';
     return str_block;
   }
});

var ParamValor = Ember.Object.extend({
   build: function() {
     var str_block = '';
     str_block += '<value name="NOMBRE">'.replace("NOMBRE", this.get('nombre_param'));
     
     str_block += '<block type="TIPO">'.replace("TIPO", this.get('tipo_bloque'));
     
     str_block += '<field name="TIPO">'.replace("TIPO", this.get('nombre_valor'));
     str_block += this.get('valor');
     str_block += '</field>';
     
     str_block += '</block>';
     
     str_block += '</value>';
     
     return str_block;
   }
});

var Lenguaje = Ember.Object.extend({
   build: function() {
     var str_toolbox = '';
     
     str_toolbox += '<xml>';
     
     this.get('categorias').forEach(function(item) {
         str_toolbox += item.build();
     });
     
     str_toolbox += '</xml>';
     
     return str_toolbox;
   }
});

/*
   Bloques que son parte de la actividad "Alien"
*/

var alien_primitivas = BloqueCategoria.create({
   nombre: 'Alien'
});

alien_primitivas.agregar_simple('alien-ir_derecha');
alien_primitivas.agregar_simple('alien-ir_izquierda');
alien_primitivas.agregar_simple('alien-ir_arriba');
alien_primitivas.agregar_simple('alien-ir_abajo');
alien_primitivas.agregar_simple('alien-recoger');

var alien_control = BloqueCategoria.create({
   nombre: 'Control'
});

alien_control.agregar_con_params('repetir', [
  ParamValor.create({
    nombre_param: "count",
    tipo_bloque: "math_number",
    nombre_valor: "NUM",
    valor: "10"
  })
]);

alien_control.agregar_simple('si');
alien_control.agregar_simple('sino');
alien_control.agregar_simple('hasta');

var alien_expresiones = BloqueCategoria.create({
   nombre: 'Expresiones'
});

alien_expresiones.agregar_simple('math_number');
alien_expresiones.agregar_simple('math_arithmetic');
alien_expresiones.agregar_simple('logic_boolean');
alien_expresiones.agregar_simple('logic_compare');
alien_expresiones.agregar_simple('logic_operation');
alien_expresiones.agregar_simple('logic_negate');

var alien_variables = new BloqueCategoriaVariables();
var alien_subtareas = new BloqueCategoriaSubtareas();

var alien_lenguaje = Lenguaje.create({
   categorias: [alien_primitivas, alien_control, alien_expresiones, alien_variables, alien_subtareas]
});

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
      this.sendAction('guardar');
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

    this.cargar_escenario(this.escenario);

  }.on('didInsertElement'),

  definir_bloques: function(leng) {
    Blockly.updateToolbox(leng);
  },

  cargar_escenario: function(escenario) {
    var escenarios = {};

    escenarios.alien_laberinto = function() {
      this.definir_bloques(alien_lenguaje.build());
    }.bind(this);

    if (escenario in escenarios) {
      escenarios[escenario].call(this);
    }
    else {
      throw new Error("No se puede cargar el escenario {{ESCENARIO}}, al parecer no está declarado en pilas-blockly.js".replace("{{ESCENARIO}}", escenario));
    }
  }
});
