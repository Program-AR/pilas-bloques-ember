import {AccionBuilder, Repetir, Si, Sino, Hasta, Procedimiento} from 'pilas-engine-bloques/actividades/bloques';
import {IrDerecha, SiguienteFilaTotal} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {Numero,OpAritmetica} from 'pilas-engine-bloques/actividades/expresiones';

var DejarRegalo = AccionBuilder.build({
  descripcion: 'Dejar regalo',
  icono: 'icono.regalo.png',
  comportamiento: 'Depositar',
  argumentos: '{claseADepositar: RegaloAnimado}',
});

export default {
  nombre: 'Salvando la Navidad',
  id: 'SalvandoLaNavidad',
  enunciado: 'Ayudá a Papá Noel a dejar un regalo al final de cada fila. ¡Tené en cuenta que el escenario no cambia!',


  // la escena proviene de ejerciciosPilas
  escena: SalvandoLaNavidad,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Si, Sino, Hasta,  IrDerecha, DejarRegalo, SiguienteFilaTotal,Numero,OpAritmetica],
};
