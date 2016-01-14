import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Repetir,Procedimiento,Accion} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;

var AgarrarLlave = Accion.extend({
  init() {
    this._super();
    this.set('id', 'AgarrarLlave');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
    .appendField('Agarrar llave')
    .appendField(this.obtener_icono('llave.png'));
  },

  nombre_comportamiento() {
    return 'TomarPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\':\'LlaveAnimado\'}';
  }
});

var actividadLaGranAventuraDelMarEncantado = {
  nombre: 'La gran aventura del mar encantado',
  enunciado: '',
  consignaInicial: '',
  escena: LaGranAventuraDelMarEncantado, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],
  variables: [],
  control: [Repetir],
  expresiones: [],
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, AgarrarLlave],
  sensores: []
};

export default actividadLaGranAventuraDelMarEncantado;
