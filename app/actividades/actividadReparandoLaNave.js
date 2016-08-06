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
            .appendField('Agarrar hierro');
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
            .appendField('Agarrar carbón');
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
            .appendField('Poner en la nave');
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
          return 'Escapar';
      },

      argumentos() {
          return '{receptor: pilas.escena_actual().nave, escaparCon: pilas.escena_actual().automata}';

      }
});





var actividadReparandoLaNave = {
  // DEPRECATED: nombre: 'Reparando la nave',
  id: 'ReparandoLaNave',
  // DEPRECATED: enunciado: 'El marciano debe arreglar su nave para poder volver a su hogar. Para lograrlo debe llevar 3 unidades de carbón y 3 de hierro a la nave, pero no puede cargar más de una unidad a la vez.',

  // DEPRECATED: escena: ReparandoLaNave,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, IrDerecha, IrIzquierda, IrArriba, IrAbajo, TomarHierro, TomarCarbon,Depositar,Escapar],
};

export default actividadReparandoLaNave;
