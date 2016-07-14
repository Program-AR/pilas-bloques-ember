import {Repetir, ParamValor, Bloque, Si, Sino, Hasta, Procedimiento, Accion} from 'pilas-engine-bloques/actividades/bloques';
import {IrAbajo, IrIzquierda, IrDerecha, IrArriba} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {EncenderLuz,TocandoLuz} from 'pilas-engine-bloques/actividades/bloquesTito';
import {Numero,OpComparacion,OpAritmetica,Texto} from 'pilas-engine-bloques/actividades/expresiones';
import {Valores} from 'pilas-engine-bloques/actividades/categorias';

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


var LaDerecha = Bloque.extend({
  _categoria: Valores,

  init() {
    this._super();
    this.set('id', 'LaDerecha');
  },

  block_init(block) {
    this._super(block);

    block.setColour(Blockly.Blocks.sensores.COLOUR);
    block.setInputsInline(true);
    block.setOutput(true);

    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('la derecha');
  },

  block_javascript() {
    return ['DirCasillaDerecha', Blockly.JavaScript.ORDER_ATOMIC];
  },

});


export default {
  nombre: 'Tito cuadrado',
  id: 'TitoCuadrado',
  enunciado: 'Tito debe encender todas las luces del cuadrado, en cada ejecución distribuidas de una manera diferente. Tené en cuenta que las casillas de la esquina nunca se prenden y que el tamaño del cuadrado no varía de una ejecución a la otra.',

  escena: TitoCuadrado,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [MoverA, LaDerecha, Procedimiento, Repetir, Si, Sino, Hasta, TocandoLuz, EncenderLuz,
    IrAbajo,IrArriba,IrIzquierda,IrDerecha,/*Numero,*/OpComparacion,OpAritmetica/*,Texto*/],
};
