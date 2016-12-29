import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder, Repetir, Si, Procedimiento} = bloques;

var Avanzar = AccionBuilder.build({
  id: 'Avanzar',
  descripcion: 'Mover a la derecha',
  icono: '../../iconos/derecha.png',
  comportamiento: 'MoverACasillaDerecha',
  argumentos: '{velocidad: 25}',
});

var ComerBanana = AccionBuilder.build({
  id: 'Comerbanana',
  descripcion: 'Comer banana',
  icono: 'iconos.banana.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{etiqueta: "BananaAnimada", nombreAnimacion: "comerBanana" }',
});

var TocandoBanana = AccionBuilder.buildSensor({
  id: 'Tocandobanana',
  descripcion: 'Hay banana acá',
  icono: 'iconos.banana.png',
  funcionSensor: 'tocando("BananaAnimada")',
});

export default {
  // DEPRECATED: nombre: 'El mono y las bananas',
  id: 'ElMonoYLasBananas',
  // DEPRECATED: enunciado:
  //  '¿Podés hacer que el mono avance al casillero de enfrente?'+
  //  ' Si hay una banana debe comérsela. Si no, es feliz con sólo llegar. \n '+
  //  'Ejecutá el programa varias veces para asegurarte que siempre funciona. \n' +
  //  'Pista: mirá la categoría "Sensores" y la categoría "Control".',

  // DEPRECATED: consignaInicial: 'El bloque "Si... Entonces" ejecuta una secuencia de instrucciones solamente cuando la condición es verdadera. Esto se llama "alternativa condicional".',
  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: ElMonoYLasBananas,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, ComerBanana,Avanzar, TocandoBanana, Repetir,Si],
};
