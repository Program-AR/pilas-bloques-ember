import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Accion, /*Sensor,*/ Repetir,Si,Procedimiento} = bloques;
var {IrDerecha, IrArriba} = direcciones;

var VolverABordeIzquierdo = Accion.extend({

  init() {
    this._super();
    this.set('id', 'VolverABordeIzquierdo');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
    .appendField('volver todo a ')
    .appendField(this.obtener_icono('izquierda.png'));

  },

  nombre_comportamiento() {
    return 'MoverTodoAIzquierda';
  },


  argumentos() {
    return '{}';
  }

});

var TomarEstrella = Accion.extend({
  init() {
    this._super();
    this.set('id', 'TomarEstrella');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('tomar ')
         .appendField(this.obtener_icono('../libs/data/icono.estrella.png'));
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';


  },

  argumentos() {
  return '{\'etiqueta\':\'EstrellaAnimada\', \'mensajeError\': \'Acá no hay una estrella\'}';

  }
});

var actividadElRecolectorDeEstrellas = {
  nombre: 'El recolector de estrellas',
  enunciado: 'A definir.',
  consignaInicial: 'A definir.',

  escena: ElRecolectorDeEstrellas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir,Si],
  expresiones: [],
  acciones: [IrDerecha, IrArriba,VolverABordeIzquierdo,TomarEstrella],
  sensores: []
};

export default actividadElRecolectorDeEstrellas;
