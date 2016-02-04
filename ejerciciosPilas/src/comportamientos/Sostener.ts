/// <reference path="ComportamientoColision.ts"/>

/*
Este comportamiento Agarra al objeto y refleja en un contador
el valor.
Argumentos adicionales al comportamiento colision: puedoSostenerMasDeUno (por defecto es falso)
*/
class Sostener extends ComportamientoColision {

  metodo(objetoColision){
			// TODO: Habría que separarlo en dos comportamientos, Tomar por un lado, Contar por el otro.
			var objetoAgarrado = objetoColision.clonar();
      objetoAgarrado.escala = objetoColision.escala;
      objetoAgarrado.y = this.receptor.y;
      objetoAgarrado.x = this.receptor.subactores[0].derecha - (this.receptor.subactores[0].ancho / 4);
      this.receptor.agregarSubactor(objetoAgarrado);
      objetoAgarrado.cargarAnimacion("correr"); // porque tiene que cargar la misma imagen que va a usar al moverse


      objetoColision.disminuir('cantidad',1);
      if (objetoColision['cantidad'] == 0) {
          objetoColision.eliminar()
        }
  }

  verificarCondicionesDeEjecucion() {
    super.verificarCondicionesDeEjecucion();
    if (!this.puedoSostener()) throw new ActividadError("No puedo sostener dos cosas a la vez...");
  }

  debeEjecutarse() {
    return super.debeEjecutarse() && this.puedoSostener();
  }

  puedoSostener(){
    return this.argumentos.puedoSostenerMasDeUno || !this.receptor.tieneAlgoEnLaMano();
  }
}

class Soltar extends ComportamientoColision {
  metodo(objetoColision) {
    this.receptor.eliminarUltimoSubactor();
  }

  verificarCondicionesDeEjecucion(){
    super.verificarCondicionesDeEjecucion();
    if (!this.receptor.tieneAlgoEnLaMano()) throw new ActividadError("No tengo nada en la mano");
  }

  debeEjecutarse(){
    return super.debeEjecutarse() && this.receptor.tieneAlgoEnLaMano();
  }
}