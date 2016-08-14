import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
var {Repetir, Procedimiento,Accion} = bloques;
var {IrDerecha,IrIzquierda,IrAbajo,IrArriba} = direcciones;



var AlimentarPez = Accion.extend({
      init() {
        this._super();
        this.set('id', 'AlimentarPez');
      },


      block_init(block) {
        this._super(block);
        block.appendDummyInput()
            .appendField(this.obtener_icono('../libs/data/icono.pez.png'))
            .appendField('Alimentar pez');


      },

      nombre_comportamiento() {
        return 'RecogerPorEtiqueta';
      },


      argumentos() {
        return '{etiqueta: "PezAnimado", idTransicion: "alimentarPez" }';




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
                 .appendField(this.obtener_icono('../libs/data/icono.alimento_pez.png'))
                 .appendField('Agarrar comida');
          },

          nombre_comportamiento() {
            return 'RecogerPorEtiqueta';
          },


          argumentos() {
            return   '{etiqueta: "AlimentoAnimado", idTransicion: "recogerComida" }';


          }
        });
var actividadAlimentandoALosPeces = {
  nombre: 'Alimentando a los peces',
  id: 'AlimentandoALosPeces',
  enunciado:'Nuestro buzo debe alimentar con lombrices a los 7 peces que hay en esta escena. Buscá primero a las lombrices y luego pasá por cada pez alimentándolo. Pista: pensá en una estrategia de 3 partes.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: AlimentandoALosPeces,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento,Repetir,IrDerecha,IrIzquierda,IrAbajo,IrArriba,AlimentarPez,AgarrarComida],
};

export default actividadAlimentandoALosPeces;
