/*

siguienteFila(){
 this.robot.hacer_luego(avanzarFilaEnCuadriculaMultiple,{'cuadriculaMultiple':this.cuadricula})
}*/

import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor, Si,Repetir,Procedimiento,Hasta} = bloques;

var Avanzar = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Avanzar');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('avanzar')
         .appendField(this.obtener_icono('derecha.png'));
  },

  nombre_comportamiento() {
    return 'MoverACasillaDerecha';
  },

  argumentos() {
    return '{}';
  }
});

var Atras = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Atras');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
     .appendField('atrás')
     .appendField(this.obtener_icono('izquierda.png'));
   },

  nombre_comportamiento() {
    return 'MoverACasillaIzquierda';
  },

  argumentos() {
    return '{}';
  }
});

var SiguienteFila = Accion.extend({
  init() {
    this._super();
    this.set('id', 'SiguienteFila');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('siguiente fila')
         .appendField(this.obtener_icono('abajo.png'));
  },

  nombre_comportamiento() {
    return 'avanzarFilaEnCuadriculaMultiple';
  },

  argumentos() {
    return '{}';
  }
});


var PatearPelota = Accion.extend({
  init() {
    this._super();
    this.set('id', 'PatearPelota');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('patear')
         .appendField(this.obtener_icono('../libs/data/iconos.pelota.png'));
  },

  nombre_comportamiento() {
    return 'DesencadenarHabilidadSiColiciona';
  },

  argumentos() {
    return '{"Habilidad":SerPateado,\'etiqueta\':\'PelotaAnimada\',\'mensajeError\': \'No hay una pelota aquí\',\'argumentosHabilidad\':{\'tiempoEnElAire\':25,\'aceleracion\':0.0025,\'elevacionMaxima\':25,\'gradosDeAumentoStep\':-2}}';
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
         .appendField('¿tocando')
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
         .appendField('¿tocando')
         .appendField(this.obtener_icono('../libs/data/iconos.pelota.png'))
         .appendField('?');
  },

  nombre_sensor() {
    return 'tocando(\'PelotaAnimada\')';
  }
});



var actividadFutbolRobots = {
  nombre: 'Fútbol de Robots',
  enunciado: 'Ayudá a nuestro robot futbolista a patear todas las pelotas. ' +
    'Recordá siempre que una buena división en tareas puede ayudarte a encarar '+
    'mejor el problema.',

  consignaInicial: 'El procedimiento que se defina debe considerar el escenario variable del protagonista y ofrecer una solución con la menor cantidad de bloques posibles. Es importante tener en cuenta que la acción se repite varias veces y que la longitud de las filas varía.',

  // la escena proviene de ejerciciosPilas
  escena: FutbolRobots, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si,Repetir,Hasta],
  expresiones: [],
  acciones: [Avanzar,Atras,SiguienteFila,PatearPelota],
  sensores: [TocandoInicio,TocandoPelota],
};

export default actividadFutbolRobots;
