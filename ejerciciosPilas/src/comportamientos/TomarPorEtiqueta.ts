/// <reference path="ComportamientoColision.ts"/>



class TomarPorEtiqueta extends ComportamientoColision{
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
