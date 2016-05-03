import {AccionBuilder, Repetir, Si, Sino, Hasta, Procedimiento} from 'pilas-engine-bloques/actividades/bloques';
import {IrDerecha, SiguienteFilaTotal} from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var DejarRegalo = AccionBuilder.build({
  descripcion: 'Dejar regalo',
  icono: 'icono.regalo.png',
  comportamiento: 'Depositar',
  argumentos: '{claseADepositar: RegaloAnimado}',
});

export default {
  nombre: 'Salvando la Navidad',
  id: 'SalvandoLaNavidad',
  enunciado:
    'TODO',

  // la escena proviene de ejerciciosPilas
  escena: SalvandoLaNavidad,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Si, Sino, Hasta,  IrDerecha, DejarRegalo, SiguienteFilaTotal],
};
