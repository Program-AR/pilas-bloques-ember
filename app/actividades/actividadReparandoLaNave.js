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
        return 'TomarYContarPorEtiqueta';
      },


      argumentos() {
        return '{\'etiqueta\' : \'HierroAnimado\', \'idComportamiento\' : \'tomarHierro\', \'dondeReflejarValor\':pilas.escena_actual().hierro }';
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
        return 'TomarYContarPorEtiqueta';
      },


      argumentos() {
        return '{\'etiqueta\' : \'CarbonAnimado\', \'idComportamiento\' : \'tomarCarbon\', \'dondeReflejarValor\':pilas.escena_actual().carbon }';
      }
    });



/*
  tomarHierro(){
        this.personaje.hacer_luego(TomarYContarPorEtiqueta,{'etiqueta':'HierroAnimado','mensajeError':'No hay hierro aquí','dondeReflejarValor': this.cantidadHierro,'idComportamiento' : 'tomarHierro'})
  }

  tomarCarbon(){
    this.personaje.hacer_luego(TomarYContarPorEtiqueta,{'etiqueta':'CarbonAnimado','mensajeError':'No hay Carbon aquí','dondeReflejarValor': this.cantidadCarbon,'idComportamiento' : 'tomarCarbon'})
  }

  depositar(){
    this.personaje.hacer_luego(Depositar,{'etiqueta':'NaveAnimada','mensajeError':'La nave no está aquí','idComportamiento' : 'depositar'})
  }

  escapar(){
  this.personaje.hacer_luego(RepetirHasta,{'secuencia':this.secuenciaCaminata, 'condicion':this.condicion });
}*/


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
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, TomarHierro, TomarCarbon],
  sensores: []
};

export default actividadReparandoLaNave;
