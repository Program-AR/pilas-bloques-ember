import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
//import comer from 'pilas-engine-bloques/actividades/comer';
var {AccionBuilder, Repetir, Si, Sino, Hasta, Procedimiento, Funcion} = bloques;
var {IrDerecha, IrArriba} = direcciones;

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
  nombre: 'El planeta de Nano',
  enunciado: 'Ayudá a Nano a recoger todas sus frutas. ¡Cuidado! No se puede bajar...',
  consignaInicial: 'A los procedimientos se les pueden agregar parámetros para que resulten más generales. Por ejemplo, si creamos los procedimientos "Avanzar 2 casillas", "Avanzar 3 casillas" y "Avanzar 4 casillas", podemos reemplazar a los 3 por un solo procedimiento que reciba como parámetro la cantidad de casillas que queremos avanzar: "Avanzar [cantidad] casillas".',
  id: 'ElPlanetaDeNano',
  // la escena proviene de ejerciciosPilas
  escena: ElPlanetaDeNano, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  usaParametros: true,

  control: [Repetir,Si,Sino,Hasta],
  expresiones: [Funcion],
  acciones: [IrDerecha,IrArriba,VolverAlBordeIzquierdo,ComerBanana],
  sensores: [],
};
