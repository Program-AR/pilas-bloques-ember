import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {AccionBuilder, Repetir, Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;

var LevantarTuerca = AccionBuilder.build({
  descripcion: 'Levantar tuerca',
  id: 'LevantaTuerca',
  icono: 'tuerca.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{etiqueta: "TuercaAnimada", mensajeError: "No hay tuerca aquí", pasos: 50}',
});

var actividadAlien = {
  // DEPRECATED: nombre: 'El alien y las tuercas',
  id: 'ElAlienYLasTuercas',
  // DEPRECATED: enunciado: 'Definí un programa para que el alien junte todas las tuercas. Pista: ¿El alien no puede moverse en diagonal? Podés crear tu propio procedimiento para que lo haga',

  // DEPRECATED: escena: AlienLevantaTuercas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, IrDerecha, IrIzquierda, IrArriba, IrAbajo, LevantarTuerca],
};

export default actividadAlien;
