/* globals ReparandoLaNave */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Repetir, Procedimiento, Accion} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;

var TomarHierro = Accion.extend({
      init() {
        this._super();
        this.set('id', 'TomarHierro');
      },


      block_init(block) {
        this._super(block);
        block.appendDummyInput()
            .appendField(this.obtener_icono('../libs/data/icono.hierro.png'))
            .appendField('Tomar Hierro');
      },

      nombre_comportamiento() {
        return 'Sostener';
      },


      argumentos() {
        return '{\'etiqueta\' : \'HierroAnimado\', \'idTransicion\' : \'tomarHierro\' }';
      }
    });

var TomarCarbon = Accion.extend({
      init() {
        this._super();
        this.set('id', 'TomarCarbon');
      },


      block_init(block) {
        this._super(block);
        block.appendDummyInput()
            .appendField(this.obtener_icono('../libs/data/icono.carbon.png'))
            .appendField('Tomar Carbon');
      },

      nombre_comportamiento() {
        return 'Sostener';
      },


      argumentos() {
        return '{\'etiqueta\' : \'CarbonAnimado\', \'idTransicion\' : \'tomarCarbon\'}';
      }
    });

var Depositar = Accion.extend({
      init() {
        this._super();
        this.set('id', 'Depositar');
      },
      block_init(block) {
        this._super(block);
        block.appendDummyInput()
            .appendField('Depositar');
      },
      nombre_comportamiento() {
        return 'Depositar';
      },
      argumentos() {
        return '{\'idTransicion\' : \'depositar\'}';
      }
});

var Escapar = Accion.extend({
      init() {
        this._super();
        this.set('id', 'Escapar');
      },
      block_init(block) {
        this._super(block);
        block.appendDummyInput()
            .appendField('Escapar');
      },
      nombre_comportamiento() {
          return 'RepetirHasta';
      },

      argumentos() {
                  //return '{\'secuencia\':pilas.escena_actual().secuenciaCaminata, \'condicion\':pilas.escena_actual().condicion })';
          return '{etiqueta: "NaveAnimada", comportamiento: "MovimientoAnimado", argumentosComportamiento:{destino: {x: pilas.derecha(), y: pilas.arriba() + 100}, nombreAnimacion: \'correr\', velocidad: 30}, idTransicion:"escapar"}';

      }
});





var actividadReparandoLaNave = {
  nombre: 'Reparando la nave',
  enunciado: '.',
  consignaInicial: '.',

  escena: ReparandoLaNave,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir],
  expresiones: [],
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, TomarHierro, TomarCarbon,Depositar,Escapar],
  sensores: []
};

export default actividadReparandoLaNave;
