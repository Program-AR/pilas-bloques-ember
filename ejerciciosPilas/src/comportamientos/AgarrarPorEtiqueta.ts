/// <reference path="ComportamientoColision.ts"/>
/*
Este comportamiento permite tomar un objeto y convertirlo en subactor
del actor que lo levanta. El subactor acompaña visualmente al actor
de ahora en adelante.
*/
class AgarrarPorEtiqueta extends ComportamientoColision{
		metodo(objetoColision){
		var objetoAgarrado = objetoColision.clonar();
		objetoAgarrado.escala = objetoColision.escala;
		objetoAgarrado.y = this.receptor.y;
		objetoAgarrado.x = this.receptor.subactores[0].derecha - (this.receptor.subactores[0].ancho / 4);
		this.receptor.agregarSubactor(objetoAgarrado);
		objetoAgarrado.cargarAnimacion("correr"); // porque tiene que cargar la misma imagen que va a usar al moverse
	}

		nombreAnimacion(){
			// redefinir por subclase
			return "recoger";
		}
	}
