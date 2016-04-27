/* globals ElMonoCuentaDeNuevo */
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

export default {
  nombre: 'El mono cuenta de nuevo',
  id: 'ElMonoCuentaDeNuevo',
  enunciado: 'El mono tiene que contar otra vez las frutas, ¡pero ahora no puede verificar si ya llegó al final de una columna! Pista: mirá en la categoría "Variables" si hay algo que te pueda servir.',
  consignaInicial: 'Una variable nos permite guardar información que puede cambiar en cada ejecución del programa, incluso en una misma ejecución. Por ejemplo, el largo de cada columna varía dependiendo en qué columna esté parado el mono.',

  // la escena proviene de ejerciciosPilas
  escena: ElMonoCuentaDeNuevo,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, IrArriba,IrAbajo,SiguienteColumna,ContarBanana,ContarManzana,
    TocandoBanana, TocandoManzana, Repetir, Si, Sino, Hasta, LargoColumnaActual, EstoyAlInicio],

};
