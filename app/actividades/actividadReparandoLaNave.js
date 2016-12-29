import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Repetir, Procedimiento, AccionBuilder} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;

var TomarHierro = AccionBuilder.build({
  descripcion: 'Agarrar hierro',
  id: 'TomarHierro',
  icono: 'icono.hierro.png',
  comportamiento: 'Sostener',
  argumentos: '{etiqueta: "HierroAnimado", nombreAnimacion: "recogerHierro"}',
});

var TomarCarbon = AccionBuilder.build({
  descripcion: 'Agarrar carbón',
  id: 'TomarCarbon',
  icono: 'icono.carbon.png',
  comportamiento: 'Sostener',
  argumentos: '{etiqueta: "CarbonAnimado", nombreAnimacion: "recogerCarbon"}',
});

var Depositar = AccionBuilder.build({
  descripcion: 'Poner en la nave',
  id: 'Depositar',
  comportamiento: 'Soltar',
  argumentos: '{idTransicion: "depositar", etiqueta: "NaveAnimada"}',
});

var Escapar = AccionBuilder.build({
  descripcion: 'Escapar',
  id: 'Escapar',
  comportamiento: 'Escapar',
  argumentos: '{receptor: pilas.escena_actual().nave, escaparCon: pilas.escena_actual().automata}',
});

var actividadReparandoLaNave = {
  // DEPRECATED: nombre: 'Reparando la nave',
  id: 'ReparandoLaNave',
  // DEPRECATED: enunciado: 'El marciano debe arreglar su nave para poder volver a su hogar. Para lograrlo debe llevar 3 unidades de carbón y 3 de hierro a la nave, pero no puede cargar más de una unidad a la vez.',

  // DEPRECATED: escena: ReparandoLaNave,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, IrDerecha, IrIzquierda, IrArriba, IrAbajo, TomarHierro, TomarCarbon,Depositar,Escapar],
};

export default actividadReparandoLaNave;
