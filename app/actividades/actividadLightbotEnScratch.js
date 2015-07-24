import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula'
var {Accion, Sensor,Si,Repetir,Procedimiento} = bloques;
var {IrDerecha,IrIzquierda,IrArriba,IrAbajo} = direcciones;

var EncenderLuz = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'EncenderLuz');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField('Encender ')
         .appendField(this.obtener_icono('../libs/data/iconos.lamparita.png'));
  },

  nombre_comportamiento: function() {
    return 'EncenderLuz';
  },

  argumentos: function() {
    return '{}';
  }
});

var actividadLightbotEnScratch = {
  nombre: 'Lightbot en Scratch',
  enunciado: 'Ayudá a Lightbot a encender todas las luces',

  // la escena proviene de ejerciciosPilas
  escena: LightbotScratch,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un automata
  variables: [],
  control: [Si,Repetir],
  expresiones: [],
  acciones: [EncenderLuz,IrDerecha,IrArriba,IrAbajo,IrIzquierda],
  sensores: [],
};

export default actividadLightbotEnScratch;
