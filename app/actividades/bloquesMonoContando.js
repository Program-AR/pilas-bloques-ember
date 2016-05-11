import {Repetir, Si, Sino, Hasta, Procedimiento, VariableEspecificaGet, AccionBuilder} from 'pilas-engine-bloques/actividades/bloques';
import {IrArriba, IrAbajo, SiguienteColumna} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {TocandoBanana, TocandoManzana} from 'pilas-engine-bloques/actividades/tocando';
import {ContarBanana, ContarManzana} from 'pilas-engine-bloques/actividades/contando';

var LargoColumnaActual = VariableEspecificaGet.extend({
  init() {
        this._super();
        this.set('id', 'LargoColumnaActual');
  },

  nombre_sensor(){
    return 'largoColumnaActual()-1';
  },

  descripcion(){
    return 'largo de columna actual';
  },
});

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

var comunes = [Procedimiento, IrArriba,IrAbajo,SiguienteColumna,ContarBanana,ContarManzana,
  TocandoBanana, TocandoManzana, Repetir, Si, Sino, Hasta, EstoyAlInicio];

export {comunes, EstoyAlFin, LargoColumnaActual};
