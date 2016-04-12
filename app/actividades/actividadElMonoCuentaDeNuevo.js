/* globals ElMonoCuentaDeNuevo */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
import contando from 'pilas-engine-bloques/actividades/contando';
var {Repetir, Si, Sino, Hasta, Procedimiento, VariableLocalGet} = bloques;
var {IrArriba, IrAbajo, SiguienteColumna} = direcciones;
var {TocandoBanana, TocandoManzana} = tocando;
var {ContarBanana, ContarManzana} = contando;

var LargoFilaActual = VariableLocalGet.extend({
  init() {
        this._super();
        this.set('id', 'LargoColumnaActual');
  },

  block_init(block){
    this._super(block);
    block.appendDummyInput()
      .appendField(this.obtener_icono('../libs/data/icono.espada.png'))
      .appendField('Largo columna actual');
  },
});

export default {
  nombre: 'El mono cuenta de nuevo',
  id: 'ElMonoCuentaDeNuevo',
  enunciado: 'El mono tiene que contar otra vez las frutas, ¡pero ahora no puede verificar si ya llegó al final de una columna! Pista: mirá en la categoría "Variables" si hay algo que te pueda servir.',
  consignaInicial: 'Una variable nos permite guardar información que puede cambiar en cada ejecución del programa, incluso en una misma ejecución. Por ejemplo, el largo de cada columna varía dependiendo en qué columna esté parado el mono.',

  // la escena proviene de ejerciciosPilas
  escena: ElMonoCuentaDeNuevo,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [LargoFilaActual],
  control: [Repetir, Si, Sino, Hasta],
  expresiones: [],
  acciones: [IrArriba,IrAbajo,SiguienteColumna,ContarBanana,ContarManzana],
  sensores: [TocandoBanana, TocandoManzana],
};
