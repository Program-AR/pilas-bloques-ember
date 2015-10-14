/*
Es un comportamiento genérico con la idea de ser extendido
Sus características son

Si se está colisionando con un objeto de etiqueta A:
	Realizar acciones dependientes de ese objeto
Caso Contrario:
	El personaje principal ejecuta un mensaje de error.

La escena que lo utiliza debe tener definido
automata

*/


class ComportamientoColision extends ComportamientoAnimado {
	/*nombreAnimacion(){
		// redefinir por subclase
		return "parado";
	}*/

	alTerminarAnimacion(){
		if(pilas.escena_actual().estado !== undefined){
			 pilas.escena_actual().estado.realizarTransicion(this.argumentos['idComportamiento'],this)
			}else{
				this.elEstadoEsValido();
			}
}

	elEstadoEsValido(){
  	if (pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta'])
							.some(objeto => objeto.colisiona_con(this.receptor))) {
				this.metodo(pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta']).filter(objeto => objeto.colisiona_con(this.receptor))[0]);
				return true;
    }else{
    		pilas.escena_actual().automata.decir(this.argumentos['mensajeError']);
				return false;
   	}
  }

		metodo(objetoColision){
						//redefinir por subclase
		}



}

class DesencadenarAnimacionDobleSiColiciona extends ComportamientoColision{
	metodo(objetoColision){
		this.receptor.cargarAnimacion(this.argumentos['idAnimacionReceptor']);
		objetoColision.cargarAnimacion(this.argumentos['idAnimacion']);

	}


}


class DesencadenarAnimacionSiColiciona extends ComportamientoColision{
	metodo(objetoColision){
		objetoColision.cargarAnimacion(this.argumentos['idAnimacion']);
	}


}

class DesencadenarHabilidadSiColiciona extends ComportamientoColision{
	metodo(objetoColision){
		objetoColision.aprender(this.argumentos['Habilidad'],this.argumentos['argumentosHabilidad'])
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
