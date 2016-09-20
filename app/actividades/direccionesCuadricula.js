import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, AccionBuilder} = bloques;

var IrDerecha = AccionBuilder.build({
  descripcion: 'Mover a la derecha',
  id: 'MoverACasillaDerecha',
  icono: '../../iconos/derecha.png',
  comportamiento: 'MoverACasillaDerecha',
  argumentos: '{}',
});

var IrIzquierda = AccionBuilder.build({
  descripcion: 'Mover a la izquierda',
  id: 'MoverACasillaIzquierda',
  icono: '../../iconos/izquierda.png',
  comportamiento: 'MoverACasillaIzquierda',
  argumentos: '{}',
});

var IrArriba = AccionBuilder.build({
  descripcion: 'Mover arriba',
  id: 'MoverACasillaArriba',
  icono: '../../iconos/arriba.png',
  comportamiento: 'MoverACasillaArriba',
  argumentos: '{}',
});

var IrAbajo = AccionBuilder.build({
  descripcion: 'Mover abajo',
  id: 'MoverACasillaAbajo',
  icono: '../../iconos/abajo.png',
  comportamiento: 'MoverACasillaAbajo',
  argumentos: '{}',
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
