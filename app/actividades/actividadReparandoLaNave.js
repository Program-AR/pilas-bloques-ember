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
        return '{etiqueta: "HierroAnimado", nombreAnimacion: "recogerHierro"}';
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
        return '{etiqueta: "CarbonAnimado", nombreAnimacion: "recogerCarbon"}';
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
        return 'Soltar';
      },
      argumentos() {
        return '{idTransicion: "depositar", etiqueta: "NaveAnimada"}';
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
          return 'MovimientoAnimado';
      },

      argumentos() {
          return '{receptor: pilas.escena_actual().nave, direccion: new Direct(1,1), distancia: 600, velocidad: 8, cantPasos: 40, idTransicion: "escapar"}';

      }
});





var actividadReparandoLaNave = {
  nombre: 'Reparando la nave',
  id: 'ReparandoLaNave',
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
