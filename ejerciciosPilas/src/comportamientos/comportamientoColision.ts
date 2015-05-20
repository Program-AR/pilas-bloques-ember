/*
Es un comportamiento genérico con la idea de ser extendido
Sus características son

Si se está colisionando con un objeto de etiqueta A:
	Realizar acciones dependientes de ese objeto
Caso Contrario:
	El personaje principal ejecuta un mensaje de error.

La escena que lo utiliza debe tener definido
personajePrincipal()


*/


class ComportamientoColision extends ComportamientoAnimado {
	nombreAnimacion(){
		// redefinir por subclase
		return "parado";
	}

	alTerminarAnimacion(){
		console.log("al terminar animacion")
			if (pilas.escena_actual().estado==undefined||pilas.escena_actual().estado.admiteTransicion(this.argumentos['idComportamiento'])){
					console.log("el estado es valido")
					this.elEstadoEsValido();
			}else{
				console.log("error por estado")
					this.elErrorSeGeneroPorEstado();
			}
	}

	elErrorSeGeneroPorEstado(){

		pilas.escena_actual().personajePrincipal().decir(pilas.escena_actual().estado.errorAlIntentar(this.argumentos['idComportamiento']));

	}

	elEstadoEsValido(){
  	if (pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta'])
							.some(objeto => objeto.colisiona_con(this.receptor))) {
								console.log("hay objeto colision")
								if(pilas.escena_actual().estado!=undefined){
									console.log("etre al if")
									pilas.escena_actual().estado=pilas.escena_actual().estado.siguiente(this.argumentos['idComportamiento']);
								}
            		this.metodo(pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta']).filter(objeto => objeto.colisiona_con(this.receptor))[0]);
    }else{
    		pilas.escena_actual().personajePrincipal().decir(this.argumentos['mensajeError']);
   	}
  }

		metodo(objetoColision){
						//redefinir por subclase
		}



}

class MorderPorEtiqueta extends ComportamientoColision {


    metodo(objetoColision){
			objetoColision.cargarAnimacion("mordida");
    }
}

class EncenderPorEtiqueta extends ComportamientoColision{

	metodo(objetoColision){
		objetoColision.cargarAnimacion("prendida");


	}
}
