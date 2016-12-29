import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {AccionBuilder, Repetir,Procedimiento} = bloques;
var {IrDerecha, IrArriba} = direcciones;

var VolverABordeIzquierdo = AccionBuilder.build({
  descripcion: 'Ir al borde izquierdo',
  id: 'VolverABordeIzquierdo',
  icono: '../../iconos/izquierda.png',
  comportamiento: 'MoverTodoAIzquierda',
  argumentos: '{}',
});

var TomarEstrella = AccionBuilder.build({
  descripcion: 'Agarrar estrella',
  id: 'TomarEstrella',
  icono: 'icono.estrella.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{etiqueta: "EstrellaAnimada", "mensajeError": "Acá no hay una estrella"}',
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
