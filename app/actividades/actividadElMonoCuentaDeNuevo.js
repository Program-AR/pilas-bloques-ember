/* globals ElMonoCuentaDeNuevo */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
import contando from 'pilas-engine-bloques/actividades/contando';
var {Si, Repetir, Hasta, Procedimiento, VariableLocalGet} = bloques;
var {IrArriba, IrAbajo} = direcciones;
var {TocandoBanana, TocandoManzana} = tocando;
var {ContarBanana, ContarManzana} = contando;

var LargoFilaActual = VariableLocalGet.extend({
  init() {
        this._super();
        this.set('id', 'LargoFilaActual');
  },

  block_init(block){
    this._super(block);
    block.appendDummyInput()
      .appendField(this.obtener_icono('../libs/data/icono.espada.png'))
      .appendField('Largo de fila actual');
  },
});

export default {
  nombre: 'El mono cuenta de nuevo',
  id: 'ElMonoCuentaDeNuevo',
  enunciado: 'COMPLETAR',
  consignaInicial: 'COMPLETAR.',

  // la escena proviene de ejerciciosPilas
  escena: ElMonoCuentaDeNuevo,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [LargoFilaActual],
  control: [Si, Repetir, Hasta],
  expresiones: [],
  acciones: [IrArriba,IrAbajo,ContarBanana,ContarManzana],
  sensores: [TocandoBanana, TocandoManzana],
};
