import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {AccionBuilder, Repetir, Si, Sino, Hasta, Procedimiento} = bloques;
var {ParaLaDerecha, ParaLaIzquierda,ParaArriba, ParaAbajo,
  IrAbajo,IrArriba,IrIzquierda,IrDerecha} = direcciones;
import {Numero, OpComparacion, OpAritmetica} from 'pilas-engine-bloques/actividades/expresiones';

var PrenderFogata = AccionBuilder.build({
  descripcion: 'Prender fogata',
  icono: 'icono.FogataApagada.png',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{etiqueta: "FogataAnimada", animacionColisionado: "prendida", nombreAnimacion: "prender" }',
});

var TocandoFogata = AccionBuilder.buildSensor({
  id: 'tocandoFogata',
  descripcion: 'Hay fogata acá ',
  icono: 'icono.FogataApagada.png',
  funcionSensor: 'tocando(\'FogataAnimada\')',
});

export default {
  // DEPRECATED nombre: 'Prendiendo las fogatas',
  id: 'PrendiendoLasFogatas',
  // DEPRECATED enunciado: 'En este caso debemos encender todas las fogatas del cuadrado pero en cada ejecución están distribuidas de una manera diferente. Tené en cuenta que las casillas de la esquina nunca se prenden y que el tamaño del cuadrado no varía de una ejecución a la otra.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED escena: PrendiendoLasFogatas,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Si, Sino, Hasta, TocandoFogata, PrenderFogata,
    IrAbajo, IrArriba, IrIzquierda, IrDerecha, Numero, OpComparacion, OpAritmetica,
    ParaLaDerecha, ParaLaIzquierda, ParaArriba, ParaAbajo],
};
