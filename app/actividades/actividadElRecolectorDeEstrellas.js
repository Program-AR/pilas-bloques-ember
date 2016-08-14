import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Accion, Repetir,Procedimiento} = bloques;
var {IrDerecha, IrArriba} = direcciones;

var VolverABordeIzquierdo = Accion.extend({

  init() {
    this._super();
    this.set('id', 'VolverABordeIzquierdo');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
        .appendField(this.obtener_icono('izquierda.png'))
        .appendField('Ir al borde izquierdo');

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
         .appendField(this.obtener_icono('../libs/data/icono.estrella.png'))
         .appendField('Agarrar estrella');
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';


  },

  argumentos() {
  return '{\'etiqueta\':\'EstrellaAnimada\', \'mensajeError\': \'Acá no hay una estrella\'}';

  }
});

var actividadElRecolectorDeEstrellas = {
  // DEPRECATED: nombre: 'El recolector de estrellas',
  id: 'ElRecolectorDeEstrellas',
  // DEPRECATED: enunciado: 'Ayudá a nuestro personaje a recolectar todas las estrellas. Pista: podés hacer un procedimiento que tome una fila de estrellas.',
  // DEPRECATED: consignaInicial: 'Usar muchas veces un procedimiento te ahorra trabajo.',
  // DEPRECATED: escena: ElRecolectorDeEstrellas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, IrDerecha, IrArriba,VolverABordeIzquierdo,TomarEstrella],
};

export default actividadElRecolectorDeEstrellas;
