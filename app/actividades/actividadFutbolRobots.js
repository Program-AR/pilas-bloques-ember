import bloques from 'pilas-engine-bloques/actividades/bloques';
import direccionesCuadricula from 'pilas-engine-bloques/actividades/direccionesCuadricula';
var {AccionBuilder, Repetir, Si, Sino, Procedimiento, Hasta} = bloques;
var {IrDerecha, IrIzquierda, SiguienteFila} = direccionesCuadricula;

var PatearPelota = AccionBuilder.build({
  id: 'PatearPelota',
  descripcion: 'Patear pelota',
  icono: 'iconos.pelota.png',
  comportamiento: 'DesencadenarComportamientoSiColisiona',
  argumentos: '{"comportamiento":SerPateado, idTransicion:"patear", etiqueta:"PelotaAnimada", argumentosComportamiento: {tiempoEnElAire:25,aceleracion:0.0025,elevacionMaxima:25,gradosDeAumentoStep:-2}}',
});

var TocandoInicio = AccionBuilder.buildSensor({
  id: 'tocandoInicio',
  descripcion: 'Estoy al inicio',
  icono: 'iconos.futbolInicio.png',
  funcionSensor: 'tocandoInicio()',
});

var TocandoPelota = AccionBuilder.buildSensor({
  id: 'tocandoPelota',
  descripcion: 'Llegué a la pelota',
  icono: 'iconos.pelota.png',
  funcionSensor: 'tocando("PelotaAnimada")',
});

export default {
  // DEPRECATED: nombre: 'Fútbol para robots',
  id: 'FutbolRobots',
  // DEPRECATED: enunciado: 'Ayudá a nuestro robot futbolista a patear todas las pelotas. ' +
  //  'Recordá siempre que una buena división en procedimientos puede ayudarte a encarar '+
  //  'mejor el problema.',

  // DEPRECATED: consignaInicial: 'El procedimiento que se defina debe considerar el escenario variable y ofrecer una solución con poca cantidad de bloques. Es importante tener en cuenta que la acción se repite varias veces y que la longitud de las filas varía.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: FutbolRobots, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, IrDerecha,IrIzquierda,SiguienteFila,PatearPelota, TocandoInicio,TocandoPelota, Repetir,Si,Sino,Hasta],
};
