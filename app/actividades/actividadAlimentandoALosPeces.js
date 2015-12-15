/* globals AlimentandoALosPeces */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
var {Si, Repetir,Hasta, Procedimiento,Accion} = bloques;
var {IrDerecha,IrIzquierda,IrAbajo,IrArriba} = direcciones;



var AlimentarPez = Accion.extend({
      init() {
        this._super();
        this.set('id', 'AlimentarPez');
      },


      block_init(block) {
        this._super(block);
        block.appendDummyInput()
             .appendField('alimentar pez');


      },

      nombre_comportamiento() {
        return 'RecogerPorEtiqueta';
      },


      argumentos() {
        return '{\'etiqueta\' : \'PezAnimado\', \'mensajeError\' : \'No hay un pez aqui\', \'idComportamiento\' : \'alimentarPez\' }';




      }
    });


    var AgarrarComida = Accion.extend({
          init() {
            this._super();
            this.set('id', 'AgarrarComida');
          },


          block_init(block) {
            this._super(block);
            block.appendDummyInput()
                 .appendField('agarrar ')
                 .appendField(this.obtener_icono('../libs/data/icono.alimento_pez.png'));

          },

          nombre_comportamiento() {
            return 'RecogerPorEtiqueta';
          },


          argumentos() {
            return   '{\'etiqueta\' : \'AlimentoAnimado\',\'mensajeError\' : \'No hay una alimento aqui\', \'idComportamiento\' : \'recogerComida\' }';


          }
        });
var actividadAlimentandoALosPeces = {
  nombre: 'Alimentando a los peces',
  enunciado:'..',

  // la escena proviene de ejerciciosPilas
  escena: AlimentandoALosPeces,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Si,Repetir,Hasta],
  expresiones: [],
  acciones: [IrDerecha,IrIzquierda,IrAbajo,IrArriba,AlimentarPez,AgarrarComida],
  sensores: [],
};

export default actividadAlimentandoALosPeces;
