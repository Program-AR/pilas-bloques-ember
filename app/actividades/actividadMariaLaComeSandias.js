/* globals MariaLaComeSandias */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Accion, Repetir,Si,Procedimiento} = bloques;
var {IrDerecha,IrIzquierda, IrArriba,IrAbajo} = direcciones;


var MorderSandia = Accion.extend({
  init() {
    this._super();
    this.set('id', 'MorderSandia');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('morder ')
         .appendField(this.obtener_icono('../libs/data/sandia.png'));
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';


  },

  argumentos() {
  return '{\'etiqueta\':\'SandiaAnimada\', \'mensajeError\': \'Acá no hay una sandia\'}';

  }
});

var actividadMariaLaComeSandias = {
  nombre: 'María la come sandias',
  enunciado: 'María necesita comer de una sola vez todas las sandías. Pensá de qué manera puede hacerlo utlizando los bloques necesarios. Atención: La forma en que las sandías están distribuidas en la cuadrícula, es clave para crear la menor cantidad de procedimientos.',

  escena: MariaLaComeSandias,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir,Si],
  expresiones: [],
  acciones: [IrDerecha,IrIzquierda, IrArriba,IrAbajo,MorderSandia],
  sensores: []
};

export default actividadMariaLaComeSandias;
