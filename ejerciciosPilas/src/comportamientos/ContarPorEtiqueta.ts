/// <reference path="ComportamientoColision.ts"/>
/// <reference path="../actores/ObservadoAnimado.ts"/>

/*
Requiere que la escena tenga como atributo una instancia de la
clase contadorDeEtiquetas bajo el nombre contadorDeEtiquetas y una
funcion llamada personajePrincipal que devuelve precisamente dicho
personaje


Ejemplo de uso: ElMonoQueSabeContar.ts
*/


class ContarPorEtiqueta extends ComportamientoColision {

	iniciar(receptor){
		super.iniciar(receptor);
		if (!receptor[this.attrName()]) { 
			receptor[this.attrName()] = new ObservadoConAumentar();
			receptor[this.attrName()].cantidad = 0;
			receptor[this.attrName()].registrarObservador(pilas.escena_actual().tableros[this.argumentos.etiqueta]);
		};
	}

	metodo(objetoColision) {
		this.receptor[this.attrName()].aumentar('cantidad',1);
		if (this.argumentos.eliminar) objetoColision.eliminar();
	}

	attrName(){
		return 'cant' + this.argumentos.etiqueta;
	}
}
