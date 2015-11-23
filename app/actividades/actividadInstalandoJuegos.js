/* globals InstalandoJuegos */
import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Si, Repetir, Hasta, Procedimiento} = bloques;

var SiguienteCompu = Accion.extend({

  init() {
    this._super();
    this.set('id', 'SiguienteCompu');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('siguiente')
         .appendField(this.obtener_icono('derecha.png'));
  },

  nombre_comportamiento() {
    return 'MoverACasillaDerecha';
  },

  argumentos() {
    return '{}';
  }


});
/*
var PrenderCompu = Accion.extend({

  init() {
    this._super();
    this.set('id', 'PrenderCompu');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('prender ');
         .appendField(this.obtener_icono('derecha.png'));
  },

  nombre_comportamiento() {
    return 'PrenderPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idComportamiento\' : \'prender\' }';
  }


});






apagarCompu(){
  this.automata.hacer_luego(ApagarPorEtiqueta,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'apagar' });
}
instalarJuego(){
  this.automata.hacer_luego(InstalarPorEtiqueta,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'instalar'})
}

escribirC(){
  this.automata.hacer_luego(EscribirEnCompuAnimada,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'escribirC'})
}
escribirB(){
  this.automata.hacer_luego(EscribirEnCompuAnimada,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'escribirB'})
}
escribirA(){
  this.automata.hacer_luego(EscribirEnCompuAnimada,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'escribirA'})
  }
*/

var actividadInstalandoJuegos = {
  nombre: 'Instalando juegos',
  enunciado: 'A definir',

  // la escena proviene de ejerciciosPilas
  escena: InstalandoJuegos, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Si,Repetir,Hasta],
  expresiones: [],
  acciones: [SiguienteCompu],
  sensores: [],
};

export default actividadInstalandoJuegos;
