/* globals ReparandoLaNave */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Repetir, Si, Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;


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

  control: [Repetir,Si],
  expresiones: [],
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo],
  sensores: []
};

export default actividadReparandoLaNave;
