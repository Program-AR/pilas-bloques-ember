import {Repetir, Si, Sino, Hasta, Procedimiento, AccionBuilder} from 'pilas-engine-bloques/actividades/bloques';
import {IrArriba, IrAbajo, SiguienteColumna} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {TocandoBanana, TocandoManzana} from 'pilas-engine-bloques/actividades/tocando';
import {ContarBanana, ContarManzana} from 'pilas-engine-bloques/actividades/contando';

var LargoColumnaActual = AccionBuilder.buildSensorNumerico({
  id: 'LargoColumnaActual',
  descripcion: 'Largo de la columna actual',
  icono: 'iconos/icono.LargoCol.png',
  funcionSensor: 'largoColumnaActual()-1',
});

var EstoyAlInicio = AccionBuilder.buildSensor({
  id: 'estoyInicio',
  descripcion: 'Estoy al inicio de la columna',
  icono: 'iconos/icono.MonoInicio.png',
  funcionSensor: 'casillaActual().esInicio()',
});

var EstoyAlFin = AccionBuilder.buildSensor({
  id: 'estoyFinColumna',
  descripcion: 'Estoy al final de la columna',
  icono: 'iconos/icono.MonoFinal.png',
  funcionSensor: 'casillaActual().esFin()',
});

var comunes = [Procedimiento, IrArriba,IrAbajo,SiguienteColumna,ContarBanana,ContarManzana,
  TocandoBanana, TocandoManzana, Repetir, Si, Sino, Hasta, EstoyAlInicio];

export {comunes, EstoyAlFin, LargoColumnaActual};
