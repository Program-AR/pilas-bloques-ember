import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Si, Repetir, Procedimiento} = bloques;
var {IrAbajo} = direcciones;
var {EncenderLuz,TocandoLuz} = bloquesTito;

var actividadTitoRecargado = {
  nombre: 'Tito recargado',
  enunciado: 'Tito necesita encender las luces para poder conocer el camino. ¡Atención! Podés utlizar las subtareas y bloques de control.',
    consignaInicial:'El procedimeinto construido debe considerar el escenario y poder responder a cada cambio propuesto.',

  // la escena proviene de ejerciciosPilas
  escena: TitoRecargado,  // jshint ignore:line
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

export default actividadTitoRecargado;
