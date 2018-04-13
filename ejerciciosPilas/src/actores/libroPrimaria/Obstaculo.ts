/// <reference path="../ActorAnimado.ts"/>

/**
 * El objetivo es que cualquier obstáculo de una cuadrícula tenga la misma forma
*/
class Obstaculo extends ActorAnimado {

		constructor(imagenes, semilla) {
			super(0, 0, {grilla: this.randomDe(imagenes, semilla)});
		}

		randomDe(lista, semilla){
			// magia matemática para elegir un elemento random usando un seed
			var x = Math.sin(semilla) * 10000;
			var index = Math.floor((x - Math.floor(x)) * lista.length);
			return lista[index];
		}
}
