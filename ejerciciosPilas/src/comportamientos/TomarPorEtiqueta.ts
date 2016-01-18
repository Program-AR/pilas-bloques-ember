/// <reference path="ComportamientoColision.ts"/>

/*
Este comportamiento Agarra al objeto y refleja en un contador
el valor.
*/
class TomarPorEtiqueta extends ComportamientoColision {

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
}
