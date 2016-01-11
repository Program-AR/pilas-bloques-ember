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


var PrenderCompu = Accion.extend({
  init() {
    this._super();
    this.set('id', 'PrenderCompu');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('prender ')
         .appendField(this.obtener_icono('../libs/data/icono.computadora.png'));
  },

  nombre_comportamiento() {
    return 'DesencadenarAnimacionSiColisiona';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idComportamiento\' : \'prender\',\'animacionColisionado\' : \'prendida\',\'nombreAnimacion\' : \'escribir\'  }';
  }


});

var ApagarCompu = Accion.extend({
  init() {
    this._super();
    this.set('id', 'ApagarCompu');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('apagar ')
         .appendField(this.obtener_icono('../libs/data/icono.computadora.png'));
  },

  nombre_comportamiento() {
    return 'DesencadenarAnimacionSiColisiona';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idComportamiento\' : \'apagar\',\'animacionColisionado\' : \'parado\',\'nombreAnimacion\' : \'escribir\'  }';
  }


});

var InstalarJuego = Accion.extend({
  init() {
    this._super();
    this.set('id', 'InstalarJuego');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('instalar juego ');

  },

  nombre_comportamiento() {
    return 'DesencadenarAnimacionSiColisiona';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idComportamiento\' : \'instalar\',\'animacionColisionado\' : \'instalado\',\'nombreAnimacion\' : \'escribir\'  }';
  }


});




var EscribirC = Accion.extend({
  init() {
    this._super();
    this.set('id', 'EscribirC');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('escribir "C"');

  },

  nombre_comportamiento() {
    return 'EscribirEnCompuAnimada';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idComportamiento\' : \'escribirC\'}';
  }


});

var EscribirB = Accion.extend({
  init() {
    this._super();
    this.set('id', 'EscribirB');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('escribir "B"');

  },

  nombre_comportamiento() {
    return 'EscribirEnCompuAnimada';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idComportamiento\' : \'escribirB\'}';
  }


});

var EscribirA = Accion.extend({
  init() {
    this._super();
    this.set('id', 'EscribirA');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('escribir "A"');

  },

  nombre_comportamiento() {
    return 'EscribirEnCompuAnimada';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idComportamiento\' : \'escribirA\'}';
  }

});


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
  acciones: [SiguienteCompu,PrenderCompu,ApagarCompu,EscribirC,EscribirB,EscribirA,InstalarJuego],
  sensores: [],
};

export default actividadInstalandoJuegos;
