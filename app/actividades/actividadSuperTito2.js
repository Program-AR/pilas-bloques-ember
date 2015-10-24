import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Si, Repetir, Procedimiento,Hasta} = bloques;
var {IrAbajo} = direcciones;
var {EncenderLuz,TocandoLuz,TocandoFinal} = bloquesTito;





var actividadSuperTito2 = {
  nombre: 'Super Tito 2',
  enunciado: 'Ayudá a Tito a encender todas las luces. \n'+
    'Consigna.',

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
