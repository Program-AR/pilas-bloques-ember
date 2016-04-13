/* globals ElMonoQueSabeContar */
import elMonoCuentaDeNuevo from 'pilas-engine-bloques/actividades/actividadElMonoCuentaDeNuevo';
import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder} = bloques;

var EstoyAlInicio = AccionBuilder.buildSensor({
  id: 'estoyInicio',
  descripcion: 'Estoy al inicio de la columna',
  icono: 'casillainiciomono.png',
  funcionSensor: 'casillaActual().esInicio()',
});

var EstoyAlFin = AccionBuilder.buildSensor({
  id: 'estoyFinColumna',
  descripcion: 'Estoy al final de la columna',
  icono: 'casillafinalmono.png',
  funcionSensor: 'casillaActual().esFin()',
});

var ConstructorDeAct = function(){};
ConstructorDeAct.prototype = elMonoCuentaDeNuevo;
var elMonoQueSabeContar = new ConstructorDeAct();

elMonoQueSabeContar.nombre = 'El mono que sabe contar';
elMonoQueSabeContar.id = 'ElMonoQueSabeContar';
elMonoQueSabeContar.enunciado = 'El mono debe recorrer todas las casillas y contar cuántas bananas y manzanas hay en total. Pista: primero pensá cómo contarías si hay una manzana o una banana en una casilla determinada. Luego pensá cómo harías para contar todas las frutas de una sola columna.';
elMonoQueSabeContar.consignaInicial = 'Subdividir un problema grande en problemas más pequeños ayuda a comprender mejor cada una de las partes que lo componen. Además nos permite concentrarnos en resolver cuestiones más sencillas al problema original.';
elMonoQueSabeContar.escena = ElMonoQueSabeContar;
elMonoQueSabeContar.sensores = elMonoCuentaDeNuevo.sensores.slice();
elMonoQueSabeContar.sensores.push(EstoyAlFin);
elMonoQueSabeContar.sensores.push(EstoyAlInicio);
elMonoQueSabeContar.variables = [];

export default elMonoQueSabeContar;
