/* globals AlienLevantaTuercas */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Accion, Sensor, Repetir,Si,Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;


var LevantarTuerca = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'LevantaTuerca');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField('Levantar ')
         .appendField(this.obtener_icono('../libs/data/tuerca.png'));
  },

  nombre_comportamiento: function() {
    return 'RecogerPorEtiqueta';
  },

  argumentos: function() {
    return '{\'etiqueta\' : \'TuercaAnimada\',  \'mensajeError\' : \'No hay una tuerca aqui\',  \'pasos\' : \'50\'}';
  }
});



var TocandoTuerca = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoTuerca');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿tocando')
         .appendField(this.obtener_icono('../libs/data/tuerca.png'))
         .appendField('?');
  },

  nombre_sensor() {
    return 'tocando(\'TuercaAnimada\')';
  }
});


var actividadAlien = {
  nombre: 'El alien y las tuercas',
  enunciado: 'Definí un programa para que el alien junte todas las tuercas.',
  consignaInicial: 'Una buena estrategia de resolución de este desafío es la división del procedimiento en sub tareas.',

  escena: AlienLevantaTuercas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir,Si],
  expresiones: [],
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, LevantarTuerca],
  sensores: [TocandoTuerca]
};

export default actividadAlien;
