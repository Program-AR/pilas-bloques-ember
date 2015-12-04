import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Si, Repetir, Procedimiento,Hasta} = bloques;
var {IrAbajo} = direcciones;
var {EncenderLuz,TocandoLuz,TocandoFinal} = bloquesTito;





var actividadSuperTito2 = {
  nombre: 'Super Tito 2',
  enunciado: 'Super Tito debe encender todas las luces, pero a diferencia del desafío anterior, esta vez no están siempre agrupadas. ¿Podrás utilizar el mismo procedimiento que en Súper Tito 1? \n',
  consignaInicial:  'Identificar procedimientos que permitan identififcar patrones que les permitan ahorrar casilleros.',
  // la escena proviene de ejerciciosPilas
  escena: SuperTito2,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un automata
  variables: [],
  control: [Si,Repetir,Hasta],
  expresiones: [],
  acciones: [EncenderLuz,IrAbajo],
  sensores: [TocandoFinal,TocandoLuz],
};

export default actividadSuperTito2;
