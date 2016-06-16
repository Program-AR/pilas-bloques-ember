import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, AccionBuilder} = bloques;

var IrDerecha = Accion.extend({

  init() {
    this._super();
    this.set('id', 'MoverACasillaDerecha');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('Ir derecha');
  },

  nombre_comportamiento() {
    return 'MoverACasillaDerecha';
  },

  argumentos() {
    return '{}';
  }


});

var IrIzquierda = Accion.extend({

  init() {
    this._super();
    this.set('id', 'MoverACasillaIzquierda');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('Ir izquierda');
  },

  nombre_comportamiento() {
    return 'MoverACasillaIzquierda';
  },


  argumentos() {
    return '{}';
  }

});


var IrArriba = Accion.extend({

  init() {
    this._super();
    this.set('id', 'MoverACasillaArriba');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('arriba.png'))
         .appendField('Ir arriba');
  },

  nombre_comportamiento() {
    return 'MoverACasillaArriba';
  },


  argumentos() {
    return '{}';
  }

});


var IrAbajo = Accion.extend({

  init() {
    this._super();
    this.set('id', 'MoverACasillaAbajo');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('abajo.png'))
         .appendField('Ir abajo');
  },

  nombre_comportamiento() {
    return 'MoverACasillaAbajo';
  },


  argumentos() {
    return '{}';
  }

});

var SiguienteFila = AccionBuilder.build({
  id: 'SiguienteFila',
  descripcion: 'Siguiente fila',
  icono: '../../iconos/abajo.png',
  comportamiento: 'SiguienteFila',
  argumentos: '{}',
});

var SiguienteFilaTotal =  SiguienteFila.extend({
  nombre_comportamiento(){
    return 'SecuenciaAnimada';
  },

  argumentos(){
    return '{secuencia: [new MoverTodoAIzquierda({}), new MoverACasillaAbajo({})]}';
  }
});

var SiguienteColumna = AccionBuilder.build({
  id: 'SiguienteColumna',
  descripcion: 'Siguiente columna',
  icono: '../../iconos/derecha.png',
  comportamiento: 'SiguienteColumna',
  argumentos: '{}',
});

var SiguienteColumnaTotal =  SiguienteColumna.extend({
  nombre_comportamiento(){
    return 'SecuenciaAnimada';
  },

  argumentos(){
    return '{secuencia: [new MoverTodoArriba({}), new MoverACasillaDerecha({})]}';
  }
});

export {IrDerecha, IrIzquierda, IrArriba, IrAbajo, SiguienteFila, SiguienteColumna, SiguienteFilaTotal, SiguienteColumnaTotal};
