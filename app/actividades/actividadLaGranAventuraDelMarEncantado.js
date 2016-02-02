import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Repetir,Procedimiento,Accion} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;

 /*agarrarLlave() {
        this.automata.hacer_luego(RecogerPorEtiqueta, {'receptor': this, 'metodo': this.doAgarrarLlave, 'nombreAnimacion': 'recoger'});
    }



    abrirCofre() {
        this.automata.hacer_luego(ComportamientoDeAltoOrden, {'receptor': this, 'metodo': this.doAbrirCofre, 'nombreAnimacion': 'recoger'});
    }

    darSombrero() {
        this.automata.hacer_luego(ComportamientoDeAltoOrden, {'receptor': this, 'metodo': this.doDarSombrero, 'nombreAnimacion': 'recoger'});
    }

    atacarConEspada() {
        this.automata.hacer_luego(ComportamientoDeAltoOrden, {'receptor': this, 'metodo': this.doAtacarConEspada, 'nombreAnimacion': 'recoger'});
    }

    escaparEnUnicornio() {
        this.automata.hacer_luego(ComportamientoDeAltoOrden, {'receptor': this, 'metodo': this.doEscaparEnUnicornio, 'nombreAnimacion': 'recoger'});
    }

*/

var AgarrarLlave = Accion.extend({
  init() {
    this._super();
    this.set('id', 'AgarrarLlave');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
    .appendField(this.obtener_icono('../libs/data/llave.png'))
    .appendField('Agarrar llave');
  },

  nombre_comportamiento() {
    return 'Sostener';
  },

  argumentos() {
    return '{etiqueta:\'LlaveAnimado\'}';
  }
});

var AbrirCofre = Accion.extend({
  init() {
    this._super();
    this.set('id', 'AbrirCofre');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
    .appendField(this.obtener_icono('../libs/data/icono.cofre.png'))
    .appendField('Abrir cofre');
  },

  nombre_comportamiento() {
    return 'Sostener';
  },

  argumentos() {
    return '{etiqueta:\'SombreroAnimado\'}';
  }
});

var actividadLaGranAventuraDelMarEncantado = {
  nombre: 'La gran aventura del mar encantado',
  enunciado: '',
  consignaInicial: '',
  escena: LaGranAventuraDelMarEncantado, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],
  variables: [],
  control: [Repetir],
  expresiones: [],
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, AgarrarLlave],
  sensores: []
};

export default actividadLaGranAventuraDelMarEncantado;
