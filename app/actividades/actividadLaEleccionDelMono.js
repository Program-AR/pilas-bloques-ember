import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor,Repetir} = bloques;
/*


avanzar(){
      this.mono.hacer_luego(MoverACasillaDerecha);
}
*/


var Avanzar = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'Avanzar');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('Avanzar');
  },

  nombre_comportamiento: function() {
    return 'MoverACasillaDerecha';
  },

  argumentos: function() {
    return '{}';
  }
});


var ComerManzana = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'ComerManzana');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('Comer Manzana');
  },

  nombre_comportamiento: function() {
    return 'RecogerPorEtiqueta';
  },

  argumentos: function() {
    return '{etiqueta : ManzanaAnimada, mensajeError : \'No hay una manzana aqui\'}';
  }
});



var ComerBanana = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'ComerBanana');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('Comer Banana');
  },

  nombre_comportamiento: function() {
    return 'RecogerPorEtiqueta';
  },

  argumentos: function() {
    return '{\'etiqueta\' : \'BananaAnimada\',  \'mensajeError\' : \'No hay una banana aqui\' }';
  }
});



/*===============================================================*/
/*var Si = EstructuraDeControl.extend({

  init: function() {
    this._super();
    this.set('id', 'si');
  },

  block_init: function(block) {
    this._super(block);
    block.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('si');
    block.appendStatementInput('block');
  },

  block_javascript: function(block) {
    var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block;
    r += 'programa.alternativa_si(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
    return r;
  }

});
*/
/*===========================================*/




var actividadLaEleccionDelMono = {
  nombre: 'La elección del mono',
  enunciado: 'Ayudá a nuestro obrero',

  escena: LaEleccionDelMono,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Repetir],
  expresiones: [],
  acciones: [ComerManzana,ComerBanana,Avanzar],
  sensores: [],
};

export default actividadLaEleccionDelMono;
