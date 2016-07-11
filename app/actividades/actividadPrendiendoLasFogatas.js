import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {AccionBuilder, Repetir, Si, Sino, Hasta, Procedimiento} = bloques;
var {IrIzquierda, IrDerecha, IrArriba, IrAbajo} = direcciones;
import {Numero, OpComparacion, OpAritmetica, Texto} from 'pilas-engine-bloques/actividades/expresiones';

var PrenderFogata = AccionBuilder.build({
  descripcion: 'Prender fogata',
  icono: 'icono.fogata.png',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{etiqueta: "FogataAnimada", animacionColisionado: "prendida", nombreAnimacion: "escribir" }',
});


var EstoyEnEsquina = AccionBuilder.buildSensor({
  descripcion: 'Estoy en una esquina',
  icono: 'casilla.prendiendoLasFogatas2.png',
  funcionSensor: 'casillaActual().esEsquina()',
});

export default {
  nombre: 'Prendiendo las fogatas',
  id: 'PrendiendoLasFogatas',
  enunciado: 'En este caso, debemos prender todas las fogatas. Pero esta vez tenés que definir un único procedimiento que prenda cualquiera de los lados.',
  consignaInicial: 'Los parámetros pueden ser de texto además de numéricos. Por ejemplo, un parámetro podría ser la dirección en que el autómata debe moverse.',

  // la escena proviene de ejerciciosPilas
  escena: PrendiendoLasFogatas,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Si, Sino, Hasta,  IrDerecha, IrArriba,
    IrAbajo, IrIzquierda, PrenderFogata, EstoyEnEsquina,
    Numero,OpComparacion,OpAritmetica, Texto
  ],
};
