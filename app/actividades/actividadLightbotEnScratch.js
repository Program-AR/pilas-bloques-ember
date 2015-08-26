import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
var {Accion, Si, Repetir, Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;

var EncenderLuz = Accion.extend({
  init() {
    this._super();
    this.set('id', 'EncenderLuz');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField('encender ')
         .appendField(this.obtener_icono('../libs/data/iconos.lamparita.png'));
  },

  nombre_comportamiento() {
    return 'EncenderLuz';
  },

  argumentos() {
    return '{}';
  }
});

var actividadLightbotEnScratch = {
  nombre: 'Lightbot ahora se llama Tito',
  enunciado: 'Ayudá a Tito a encender todas las luces. \n'+
    'Pista: esa diagonal puede ser una gran subtarea',

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
