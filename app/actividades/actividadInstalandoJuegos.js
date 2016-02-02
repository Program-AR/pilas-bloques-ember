/* globals InstalandoJuegos */
import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion,  Repetir, Procedimiento} = bloques;

var SiguienteCompu = Accion.extend({

  init() {
    this._super();
    this.set('id', 'SiguienteCompu');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('Siguiente compu')
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
         .appendField('Prender compu ')
         .appendField(this.obtener_icono('../libs/data/icono.computadora.png'));
  },

  nombre_comportamiento() {
    return 'DesencadenarAnimacionSiColisiona';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'prender\',\'animacionColisionado\' : \'prendida\',\'nombreAnimacion\' : \'escribir\'  }';
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
         .appendField('Apagar compu')
         .appendField(this.obtener_icono('../libs/data/icono.computadora.png'));
  },

  nombre_comportamiento() {
    return 'DesencadenarAnimacionSiColisiona';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'apagar\',\'animacionColisionado\' : \'parado\',\'nombreAnimacion\' : \'escribir\'  }';
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
         .appendField('Instalar juego ');

  },

  nombre_comportamiento() {
    return 'DesencadenarAnimacionSiColisiona';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'instalar\',\'animacionColisionado\' : \'instalado\',\'nombreAnimacion\' : \'escribir\'  }';
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
         .appendField('Escribir "C"');

  },

  nombre_comportamiento() {
    return 'EscribirEnCompuAnimada';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'escribirC\'}';
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
         .appendField('Escribir "B"');

  },

  nombre_comportamiento() {
    return 'EscribirEnCompuAnimada';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'escribirB\'}';
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
         .appendField('Escribir "A"');

  },

  nombre_comportamiento() {
    return 'EscribirEnCompuAnimada';
  },

  argumentos() {
    return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'escribirA\'}';
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

  control: [Repetir],
  expresiones: [],
  acciones: [SiguienteCompu,PrenderCompu,ApagarCompu,EscribirC,EscribirB,EscribirA,InstalarJuego],
  sensores: [],
};

export default actividadInstalandoJuegos;
