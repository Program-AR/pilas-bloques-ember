import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder, Repetir, Si, Sino, Procedimiento} = bloques;

var Avanzar = AccionBuilder.build({
  descripcion: 'Mover a la derecha',
  id: 'Avanzar',
  icono: '../../iconos/derecha.png',
  comportamiento: 'MoverACasillaDerecha',
  argumentos: '{}',
});

var ComerManzana = AccionBuilder.build({
  descripcion: 'Comer manzana',
  id: 'ComerManzana',
  icono: 'iconos.manzana.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{\'etiqueta\' : \'ManzanaAnimada\',  nombreAnimacion: "comerManzana"}',
});

var ComerBanana = AccionBuilder.build({
  descripcion: 'Comer banana',
  id: 'ComerBanana',
  icono: 'iconos.banana.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{\'etiqueta\' : \'BananaAnimada\',  nombreAnimacion: "comerBanana"}',
});

var TocandoManzana = AccionBuilder.buildSensor({
  descripcion: 'Hay una manzana acá',
  id: 'tocandoManzana',
  icono: 'iconos.manzana.png',
  funcionSensor: 'tocando("ManzanaAnimada")',
});

var TocandoBanana = AccionBuilder.buildSensor({
  descripcion: 'Hay una banana acá',
  id: 'tocandoBanana',
  icono: 'iconos.banana.png',
  funcionSensor: 'tocando("BananaAnimada")',
});


var actividadLaEleccionDelMono = {
  // DEPRECATED: nombre: 'La elección del mono',
  id: 'LaEleccionDelMono',
  // DEPRECATED: enunciado: '¿Podés ayudar nuevamente a nuestro mono? Esta vez tiene '+
  //   'que elegir qué fruta comer. \n'+
  //  'Ejecutá el programa varias veces para asegurarte que siempre funciona. \n' +
  //  'Pista: ésta vez no alcanza con el bloque "Si".',

  // DEPRECATED: consignaInicial: 'Cuando sólo hay 2 opciones, alcanza con hacer una sola pregunta. En esos casos se puede usar el bloque "Si... si no".',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: LaEleccionDelMono, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, ComerManzana,ComerBanana,Avanzar, TocandoManzana,TocandoBanana, Repetir,Si,Sino],
};

export default actividadLaEleccionDelMono;
