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
         .appendField(this.obtener_icono('../libs/data/icono.estrella.png'));
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
  enunciado: 'A definir.',
  consignaInicial: 'A definir.',

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
