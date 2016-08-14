import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Accion, Repetir,Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;


var LevantarTuerca = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'LevantaTuerca');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField(this.obtener_icono('../libs/data/tuerca.png'))
          .appendField('Levantar tuerca');
  },

  nombre_comportamiento: function() {
    return 'RecogerPorEtiqueta';
  },

  argumentos: function() {
    return '{\'etiqueta\' : \'TuercaAnimada\',  \'mensajeError\' : \'No hay una tuerca aquí\',  \'pasos\' : \'50\'}';
  }
});

var actividadAlien = {
  // DEPRECATED: nombre: 'El alien y las tuercas',
  id: 'ElAlienYLasTuercas',
  // DEPRECATED: enunciado: 'Definí un programa para que el alien junte todas las tuercas. Pista: ¿El alien no puede moverse en diagonal? Podés crear tu propio procedimiento para que lo haga',

  // DEPRECATED: escena: AlienLevantaTuercas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, IrDerecha, IrIzquierda, IrArriba, IrAbajo, LevantarTuerca],
};

export default actividadAlien;
