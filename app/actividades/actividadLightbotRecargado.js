import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Si, Repetir, Procedimiento} = bloques;
var {IrAbajo} = direcciones;
var {EncenderLuz,TocandoLuz} = bloquesTito;

var actividadLightbotRecargado = {
  nombre: 'Tito recargado',
  enunciado: 'Ayudá a Tito a encender todas las luces. \n'+
    'Consigna.',

  // la escena proviene de ejerciciosPilas
  escena: LightBotRecargado,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un automata
  variables: [],
  control: [Si,Repetir],
  expresiones: [],
  acciones: [EncenderLuz,IrAbajo],
  sensores: [TocandoLuz],
};

export default actividadLightbotRecargado;
