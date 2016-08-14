import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Accion, Repetir,Procedimiento} = bloques;
var {IrDerecha,IrIzquierda, IrArriba,IrAbajo} = direcciones;


var MorderSandia = Accion.extend({
  init() {
    this._super();
    this.set('id', 'MorderSandia');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('../libs/data/icono.sandia.png'))
         .appendField('Morder sandía ');
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';


  },

  argumentos() {
  return '{\'etiqueta\':\'SandiaAnimada\', \'mensajeError\': \'Acá no hay una sandia\'}';

  }
});

var actividadMariaLaComeSandias = {
  // DEPRECATED: nombre: 'María la come sandías',
  id: 'MariaLaComeSandias',
  // DEPRECATED: enunciado: 'María necesita comer todas las sandías de la cuadrícula. Pensá de qué manera puede hacerlo creando los bloques necesarios. Pista: la forma en que las sandías están distribuidas en la cuadrícula, es clave para crear la menor cantidad de procedimientos.',

  // DEPRECATED: escena: MariaLaComeSandias,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, IrDerecha,IrIzquierda, IrArriba,IrAbajo,MorderSandia],
};

export default actividadMariaLaComeSandias;
