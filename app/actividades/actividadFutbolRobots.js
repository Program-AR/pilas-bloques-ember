import bloques from 'pilas-engine-bloques/actividades/bloques';
import direccionesCuadricula from 'pilas-engine-bloques/actividades/direccionesCuadricula';
var {Accion, Sensor, Repetir, Si, Sino, Procedimiento, Hasta} = bloques;
var {IrDerecha, IrIzquierda, SiguienteFila} = direccionesCuadricula;

var PatearPelota = Accion.extend({
  init() {
    this._super();
    this.set('id', 'PatearPelota');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('Patear pelota')
         .appendField(this.obtener_icono('../libs/data/iconos.pelota.png'));
  },

  nombre_comportamiento() {
    return 'DesencadenarComportamientoSiColisiona';
  },

  argumentos() {
    return '{"comportamiento":SerPateado,\'etiqueta\':\'PelotaAnimada\',\'argumentosComportamiento\':{\'tiempoEnElAire\':25,\'aceleracion\':0.0025,\'elevacionMaxima\':25,\'gradosDeAumentoStep\':-2}}';
  }
});

var TocandoInicio = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoInicio');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿Tocando inicio ')
         .appendField(this.obtener_icono('../libs/data/iconos.futbolInicio.png'))
         .appendField('?');

  },

  nombre_sensor() {
    return 'tocandoInicio()';
  }
});

var TocandoPelota = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoPelota');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿Tocando pelota ')
         .appendField(this.obtener_icono('../libs/data/iconos.pelota.png'))
         .appendField('?');
  },

  nombre_sensor() {
    return 'tocando(\'PelotaAnimada\')';
  }
});



export default {
  nombre: 'Fútbol para robots',
  id: 'FutbolRobots',
  enunciado: 'Ayudá a nuestro robot futbolista a patear todas las pelotas. ' +
    'Recordá siempre que una buena división en procedimientos puede ayudarte a encarar '+
    'mejor el problema.',

  consignaInicial: 'El procedimiento que se defina debe considerar el escenario variable y ofrecer una solución con poca cantidad de bloques. Es importante tener en cuenta que la acción se repite varias veces y que la longitud de las filas varía.',

  // la escena proviene de ejerciciosPilas
  escena: FutbolRobots, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Repetir,Si,Sino,Hasta],
  expresiones: [],
  acciones: [IrDerecha,IrIzquierda,SiguienteFila,PatearPelota],
  sensores: [TocandoInicio,TocandoPelota],
};
