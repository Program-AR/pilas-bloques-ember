import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
//import comer from 'pilas-engine-bloques/actividades/comer';
var {AccionBuilder, Si, Repetir,Hasta, Procedimiento,Funcion} = bloques;
var {IrDerecha, IrArriba} = direcciones;

var ComerBanana = AccionBuilder.build({
  descripcion: 'Recoger Bananas',
  icono: 'iconos.banana.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{etiqueta:"BananaAnimada"}',
});

var VolverAlBordeIzquierdo = AccionBuilder.build({
  descripcion: 'Volver al borde izquierdo',
  icono: '../../iconos/izquierda.png',
  comportamiento: 'RepetirHasta',
  argumentos: '{\'secuencia\':pilas.escena_actual().secuenciaCaminata, \'condicion\':pilas.escena_actual().condicion }',
});

export default {
  nombre: 'El planeta de Nano',
  enunciado: 'Ayudá a Nano a recoger todas sus frutas. ¡Cuidado! No se puede bajar...',
  id: 'ElPlanetaDeNano',
  // la escena proviene de ejerciciosPilas
  escena: ElPlanetaDeNano, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Si,Repetir,Hasta],
  expresiones: [Funcion],
  acciones: [IrDerecha,IrArriba,VolverAlBordeIzquierdo,ComerBanana],
  sensores: [],
};
