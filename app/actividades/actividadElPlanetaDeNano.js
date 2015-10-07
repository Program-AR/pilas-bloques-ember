import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
//import comer from 'pilas-engine-bloques/actividades/comer';
var {Accion, Si, Repetir,Hasta, Procedimiento,Funcion} = bloques;
var {IrDerecha, IrArriba} = direcciones;




var ComerBanana = Accion.extend({
  /*No se puede importar porque hay que reflejar el valor*/
  init: function() {
    this._super();
    this.set('id', 'ComerBananaReflejando');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField('Comer ')
         .appendField(this.obtener_icono('../libs/data/iconos.banana.png'));
  },

  nombre_comportamiento: function() {
    return 'RecogerPorEtiqueta';
  },

  argumentos: function() {
    return '{\'etiqueta\':\'BananaAnimada\',\'mensajeError\':\'No hay una banana aquí\',\'dondeReflejarValor\':pilas.escena_actual().cantidadBananas}';
  }
});




var VolverAlBordeIzquierdo = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'VolverAlBordeIzquierdo');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
        .appendField('Volver al borde izquierdo')
         .appendField(this.obtener_icono('izquierda.png'));
  },

  nombre_comportamiento: function() {
    return 'RepetirHasta';
  },


  argumentos: function() {
    return '{\'secuencia\':pilas.escena_actual().secuenciaCaminata, \'condicion\':pilas.escena_actual().condicion }';
  }
});

var actividadElPlanetaDeNano = {
  nombre: 'El planeta de Nano',
  enunciado: 'Ayudá a Nano a recoger todas sus estrellas. ¡Cuidado! No se puede bajar...',

  // la escena proviene de ejerciciosPilas
  escena: ElPlanetaDeNano, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Si,Repetir,Hasta],
  expresiones: [Funcion],
  acciones: [IrDerecha,IrArriba,VolverAlBordeIzquierdo,ComerBanana],
  sensores: [],
};

export default actividadElPlanetaDeNano;
