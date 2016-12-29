import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder, Procedimiento} = bloques;


var Avanzar = AccionBuilder.build({
  descripcion: 'Avanzar',
  id: 'avanzar',
  icono: 'izquierda.png',
  comportamiento: 'CaminaIzquierda',
  argumentos: '{pasos: 2}',
});

var Retroceder = AccionBuilder.build({
  descripcion: 'Retroceder',
  id: 'retroceder',
  icono: 'derecha.png',
  comportamiento: 'CaminaDerecha',
  argumentos: '{pasos: 2}',
});

var Martillar = AccionBuilder.build({
  descripcion: 'Martillar',
  id: 'martillar',
  icono: 'martillar.png',
  comportamiento: 'Martillar',
  argumentos: '{veces: 20}',
});

var actividadElObreroCopado = {
  nombre: 'El obrero copado',
  id: 'ElObreroCopado',
  enunciado: 'Ayudá a nuestro obrero a martillar un poco por allí.',

  // la escena proviene de ejerciciosPilas
  escena: ElObreroCopado, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Avanzar, Retroceder, Martillar],
};

export default actividadElObreroCopado;
