import {AccionBuilder, Repetir, Si, Sino, Hasta, Procedimiento} from 'pilas-engine-bloques/actividades/bloques';
import {IrDerecha, IrArriba} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {Numero} from 'pilas-engine-bloques/actividades/expresiones';

var ComerBanana = AccionBuilder.build({
  descripcion: 'Comer Banana',
  icono: 'iconos.banana.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{etiqueta:"BananaAnimada"}',
});

var VolverAlBordeIzquierdo = AccionBuilder.build({
  descripcion: 'Volver al borde izquierdo',
  icono: '../../iconos/izquierda.png',
  comportamiento: 'MoverTodoAIzquierda',
  argumentos: '{}',
});

export default {
  // DEPRECATED: nombre: 'El planeta de Nano',
  // DEPRECATED: enunciado: 'Ayudá a Nano a recoger todas sus frutas. ¡Cuidado! No se puede bajar... \n ¡Tené en cuenta que el escenario no cambia, las bananas están siempre en las mismas casillas!',
  // DEPRECATED: consignaInicial: 'A los procedimientos se les pueden agregar parámetros para que resulten más generales. Por ejemplo, si creamos los procedimientos "Avanzar 2 casillas", "Avanzar 3 casillas" y "Avanzar 4 casillas", podemos reemplazar a los 3 por un solo procedimiento que reciba como parámetro la cantidad de casillas que queremos avanzar: "Avanzar [cantidad] casillas".',
  id: 'ElPlanetaDeNano',
  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: ElPlanetaDeNano, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  usaParametros: true,
  bloques: [Procedimiento,IrDerecha,IrArriba,VolverAlBordeIzquierdo,ComerBanana,Repetir,Si,Sino,Hasta,Numero],
};
