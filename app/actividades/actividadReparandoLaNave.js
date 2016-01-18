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
        return 'TomarPorEtiqueta';
      },


      argumentos() {
        return '{\'etiqueta\' : \'HierroAnimado\', \'idComportamiento\' : \'tomarHierro\' }';
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
        return 'TomarPorEtiqueta';
      },


      argumentos() {
        return '{\'etiqueta\' : \'CarbonAnimado\', \'idComportamiento\' : \'tomarCarbon\', \'dondeReflejarValor\':pilas.escena_actual().carbon }';
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
        return '{\'idComportamiento\' : \'depositar\', \'etiqueta\' : \'NaveAnimada\'}';
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
          return 'DesencadenarComportamientoSiColisiona';
      },

      argumentos() {
          return '{etiqueta: "NaveAnimada", comportamiento: "MovimientoAnimado", argumentosComportamiento:{destino: {x: pilas.derecha, y: pilas.arriba + 100}, nombreAnimacion: \'correr\', velocidad: 30}, idComportamiento:"escapar"}';
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
