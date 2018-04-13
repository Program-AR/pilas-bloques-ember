/// <reference path="../ActorAnimado.ts"/>

/**
 * El objetivo es que cualquier obstáculo de una cuadrícula tenga la misma forma
*/
class Obstaculo extends ActorAnimado {

		constructor(imagenes) {
			super(0, 0, {grilla: this.randomDe(imagenes)});
		}

		randomDe(lista){
				 return lista[Math.floor(Math.random()*lista.length)];
		}
}
