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
         .appendField('Mover a la derecha');
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
         .appendField('Mover a la izquierda');
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
         .appendField('Mover arriba');
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
         .appendField('Mover abajo');
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
  descripcion: 'Pasar a la siguiente fila',
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
  descripcion: 'Pasar a la siguiente columna',
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

var MoverA = Accion.extend({

  init() {
    this._super();
    this.set('id', 'MoverA');
  },

  block_init(block) {
    this._super(block);
    block.appendValueInput('direccion')
    .setCheck('Number')
    .appendField('Mover a');
  },

  nombre_comportamiento(){
    return 'MovimientoEnCuadricula';
  },

  argumentos(block){
    return '{claseDirCasilla: ' + Blockly.JavaScript.valueToCode(block, 'direccion', Blockly.JavaScript.ORDER_ATOMIC) + '}';
  },

});


var ParaLaDerecha = AccionBuilder.buildValor({
  id: 'ParaLaDerecha',
  descripcion: 'la derecha',
  icono: '../../iconos/derecha.png',
  valor: 'DirCasillaDerecha',
});

var ParaLaIzquierda = AccionBuilder.buildValor({
  id: 'ParaLaIzquierda',
  descripcion: 'la izquierda',
  icono: '../../iconos/izquierda.png',
  valor: 'DirCasillaIzquierda',
});

var ParaArriba = AccionBuilder.buildValor({
  id: 'ParaArriba',
  descripcion: 'arriba',
  icono: '../../iconos/arriba.png',
  valor: 'DirCasillaArriba',
});

var ParaAbajo = AccionBuilder.buildValor({
  id: 'ParaAbajo',
  descripcion: 'abajo',
  icono: '../../iconos/abajo.png',
  valor: 'DirCasillaAbajo',
});

export { IrDerecha, IrIzquierda, IrArriba, IrAbajo, SiguienteFila, SiguienteColumna,
  SiguienteFilaTotal, SiguienteColumnaTotal, ParaLaDerecha, ParaLaIzquierda,
  ParaArriba, ParaAbajo, MoverA
};
