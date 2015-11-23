/* globals ElGatoEnLaCalle */
import bloques from 'pilas-engine-bloques/actividades/bloques';


var {Accion,Procedimiento} = bloques;

var Saludar = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Saludar');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('saludar ')
         .appendField(this.obtener_icono('../libs/data/icono.saludar.png'));
  },

  nombre_comportamiento() {
    return 'ComportamientoAnimado';
  },


  argumentos() {
    return '{\'nombreAnimacion\':\'saludando\'}';


  }
});
var AbrirOjos = Accion.extend({
  init() {
    this._super();
    this.set('id', 'AbrirOjos');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('abrir ')
         .appendField(this.obtener_icono('../libs/data/icono.abrirOjos.png'));
  },

  nombre_comportamiento() {
    return 'ComportamientoAnimado';
  },

  argumentos() {
    return '{\'nombreAnimacion\':\'abrirOjos\'}';

  }
});

var CerrarOjos = Accion.extend({
  init() {
    this._super();
    this.set('id', 'CerrarOjos');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('cerrar ')
         .appendField(this.obtener_icono('../libs/data/icono.cerrarOjos.png'));
  },

  nombre_comportamiento() {
    return 'ComportamientoAnimado';
  },

  argumentos() {
    return '{\'nombreAnimacion\':\'cerrarOjos\'}';

  }
});

var Acostarse = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Acostarse');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('acostarse ')
         .appendField(this.obtener_icono('../libs/data/icono.acostarse.png'));
  },

  nombre_comportamiento() {
    return 'ModificarRotacionYAltura';
  },

  argumentos() {
    return '{\'alturaIr\': -180 ,\'rotacionIr\': 90}';

  }
});

var Pararse = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Pararse');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('pararse ')
         .appendField(this.obtener_icono('../libs/data/icono.pararse.png'));
  },

  nombre_comportamiento() {
    return 'ModificarRotacionYAltura';
  },

  argumentos() {
  return '{\'alturaIr\': -150 ,\'rotacionIr\': 0}';

  }
});

var Volver = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Volver');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('volver ')
         .appendField(this.obtener_icono('izquierda.png'));
  },

  nombre_comportamiento() {
    return 'ComportamientoAnimado';
  },

  argumentos() {
    return '{\'nombreAnimacion\': \'volver\'}';

  }
});

var Avanzar = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Avanzar');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('avanzar ')
         .appendField(this.obtener_icono('derecha.png'));
  },

  nombre_comportamiento() {
    return 'ComportamientoAnimado';
  },

  argumentos() {
    return '{\'nombreAnimacion\': \'correr\'}';

  }
});

var actividadElGatoEnLaCalle = {
  nombre: 'El gato en la calle',
  enunciado: 'A definir.',
  consignaInicial: 'A definir.',

  escena: ElGatoEnLaCalle,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [],
  expresiones: [],
  acciones: [Saludar,Avanzar,Volver,AbrirOjos,CerrarOjos,Acostarse,Pararse],
  sensores: []
};

export default actividadElGatoEnLaCalle;
