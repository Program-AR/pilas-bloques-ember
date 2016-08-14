import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Repetir, Si, Sino, Procedimiento} = bloques;
var {IrAbajo} = direcciones;
var {EncenderLuz,TocandoLuz} = bloquesTito;

var actividadTitoRecargado = {
  // DEPRECATED: nombre: 'Tito recargado',
  id: 'TitoRecargado',
  // DEPRECATED: enunciado: 'Tito necesita encender las luces para poder conocer el camino... ¡Pero en cada ejecución cambian de lugar! Podés utlizar los procedimientos y bloques de control.',
  //consignaInicial:'El procedimiento construido debe considerar el escenario y poder responder a cada cambio propuesto.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: TitoRecargado,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, TocandoLuz, EncenderLuz,IrAbajo, Repetir,Si,Sino],
};

export default actividadTitoRecargado;
