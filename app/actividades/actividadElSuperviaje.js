import bloques from 'pilas-engine-bloques/actividades/bloques';

var {AccionBuilder, Repetir, Si, Hasta, Procedimiento, VariableLocalGet} = bloques;

var Avanzar1km = AccionBuilder.build({
  descripcion: 'Avanzar 1 Km',
  icono: 'icono.computadora.png',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{etiqueta:"CompuAnimada", animacionColisionado:"prendida", nombreAnimacion: "escribir" }',
});

var KmsTotales = VariableLocalGet.extend({
  init() {
        this._super();
        this.set('id', 'KmsTotales');
  },

  block_init(block){
    this._super(block);
    block.appendDummyInput()
      .appendField(this.obtener_icono('../libs/data/icono.espada.png'))
      .appendField('Kms totales');
  },
});

export default {
  nombre: 'El Superviaje',
  id: 'ElSuperviaje',
  enunciado: 'El superperro debe realizar su súper paseo matutino que consiste en recorrer una cierta cantidad de kilómetros que varía día a día (entre 50 y 200 km). ¡Lográ que nuestro súper amigo llegue siempre a destino!',
  consignaInicial: 'Se puede usar un bloque "Repetir" con el valor de una variable. Esto permite repetir una secuencia de código la cantidad de veces que indique la variable.',
  
  // la escena proviene de ejerciciosPilas
  escena: SuperViaje,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [KmsTotales],
  control: [Repetir, Si, Hasta],
  expresiones: [],
  acciones: [Avanzar1km],
  sensores: [],
};
