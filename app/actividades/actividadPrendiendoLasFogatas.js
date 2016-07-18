import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {AccionBuilder, Repetir, Si, Sino, Hasta, Procedimiento, Sensor} = bloques;
var {IrIzquierda, IrDerecha, IrArriba, IrAbajo} = direcciones;
import {Numero, OpComparacion, OpAritmetica, Texto} from 'pilas-engine-bloques/actividades/expresiones';

var PrenderFogata = AccionBuilder.build({
  descripcion: 'Prender fogata',
  icono: 'icono.FogataApagada.png',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{etiqueta: "FogataAnimada", animacionColisionado: "prendida", nombreAnimacion: "prender" }',
});

var TocandoFogata = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoFogata');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿Hay fogata acá ')
         .appendField(this.obtener_icono('../libs/data/icono.FogataApagada.png'))
         .appendField(' ?');
  },

  nombre_sensor() {
    return 'tocando(\'FogataAnimada\')';
  }
});


export default {
  nombre: 'Prendiendo las fogatas',
  id: 'PrendiendoLasFogatas',
  enunciado: 'En este caso debemos encender todas las fogatas del cuadrado pero en cada ejecución están distribuidas de una manera diferente. Tené en cuenta que las casillas de la esquina nunca se prenden y que el tamaño del cuadrado no varía de una ejecución a la otra.',

  // la escena proviene de ejerciciosPilas
  escena: PrendiendoLasFogatas,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Si, Sino, Hasta, TocandoFogata, PrenderFogata,
    IrAbajo,IrArriba,IrIzquierda,IrDerecha,Numero,OpComparacion,OpAritmetica,Texto],
};
