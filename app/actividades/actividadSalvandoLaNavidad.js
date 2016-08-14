import {AccionBuilder, Repetir, Si, Sino, Hasta, Procedimiento} from 'pilas-engine-bloques/actividades/bloques';
import {IrDerecha, SiguienteFilaTotal} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {Numero,OpAritmetica} from 'pilas-engine-bloques/actividades/expresiones';

var DejarRegalo = AccionBuilder.build({
  id: 'Dejarregalo',
  descripcion: 'Dejar un regalo',
  icono: 'icono.regalo.png',
  comportamiento: 'Depositar',
  argumentos: '{claseADepositar: RegaloAnimado}',
});

export default {
  // DEPRECATED: nombre: 'Salvando la Navidad',
  id: 'SalvandoLaNavidad',
  // DEPRECATED: enunciado: 'Ayudá a Papá Noel a dejar un regalo al final de cada fila. ¡Tené en cuenta que el escenario no cambia de una ejecución a la otra! Pista: si tuvieses que elegir un parámetro para tu procedimiento... ¿Cuál eligirías?',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: SalvandoLaNavidad,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Si, Sino, Hasta,  IrDerecha, DejarRegalo, SiguienteFilaTotal,Numero,OpAritmetica],
};
