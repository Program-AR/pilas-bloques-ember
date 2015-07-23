import Ember from 'ember';
import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion} = bloques;

var IrDerecha = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'MoverACasillaDerecha');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('ir derecha');
  },

  nombre_comportamiento: function() {
    return 'MoverACasillaDerecha';
  },

  argumentos: function() {
    return '{}';
  }


});

var IrIzquierda = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'MoverACasillaIzquierda');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('ir izquierda');
  },

  nombre_comportamiento: function() {
    return 'MoverACasillaIzquierda';
  },


  argumentos: function() {
    return '{}';
  }

});


var IrArriba = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'MoverACasillaArriba');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('arriba.png'))
         .appendField('ir arriba');
  },

  nombre_comportamiento: function() {
    return 'MoverACasillaArriba';
  },


  argumentos: function() {
    return '{}';
  }

});


var IrAbajo = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'MoverACasillaAbajo');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('abajo.png'))
         .appendField('ir abajo');
  },

  nombre_comportamiento: function() {
    return 'MoverACasillaAbajo';
  },


  argumentos: function() {
    return '{}';
  }

});


var direcciones = {IrDerecha,IrIzquierda,IrArriba,IrAbajo};

export default direcciones;
