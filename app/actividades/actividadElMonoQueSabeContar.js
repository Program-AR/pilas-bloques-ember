/* globals ElMonoQueSabeContar */
import elMonoCuentaDeNuevo from 'pilas-engine-bloques/actividades/actividadElMonoCuentaDeNuevo';
import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder} = bloques;

var EstoyAlFin = AccionBuilder.buildSensor({
  descripcion: 'Estoy al final de la fila',
  icono: 'casillafinalmono.png',
  funcionSensor: 'casillaActual().esFin()',
});

var elMonoQueSabeContar = {};
elMonoQueSabeContar = Object.create(elMonoCuentaDeNuevo);

elMonoQueSabeContar.nombre = 'El mono que sabe contar';
elMonoQueSabeContar.id = 'ElMonoQueSabeContar';
elMonoQueSabeContar.enunciado = 'COMPLETAR';
elMonoQueSabeContar.consignaInicial = 'COMPLETAR';
elMonoQueSabeContar.escena = ElMonoQueSabeContar;
elMonoQueSabeContar.sensores = elMonoCuentaDeNuevo.sensores;
elMonoQueSabeContar.sensores.push(EstoyAlFin);
elMonoQueSabeContar.variables = [];

export default elMonoQueSabeContar;