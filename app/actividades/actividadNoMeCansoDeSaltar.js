import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder, Repetir, Procedimiento} = bloques;

var Saltar = AccionBuilder.build({
  descripcion: 'Saltar',
  id: 'saltar1',
  icono: '../../iconos/arriba.png',
  comportamiento: 'SaltarHablando',
  argumentos: '{ velocidad_inicial: 30, alturaDeseada: 150, cantPasos: 20 }',
});

var actividadNoMeCansoDeSaltar = {
  // DEPRECATED: nombre: 'No me canso de saltar',
  id: 'NoMeCansoDeSaltar',
  // DEPRECATED: enunciado: 'Ayudá al gato a quitarse la pereza saltando 30 veces seguidas. Pista: se puede resolver con menos de 30 bloques.',
  // DEPRECATED: consignaInicial: 'El bloque Repetir permite elegir la cantidad de veces que se desea repetir una secuencia de acciones. Esto se llama "Repetición simple".',

  // DEPRECATED: escena: NoMeCansoDeSaltar,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Saltar],
};

export default actividadNoMeCansoDeSaltar;
