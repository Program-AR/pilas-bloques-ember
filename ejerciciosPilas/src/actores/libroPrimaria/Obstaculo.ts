/// <reference path="../ActorAnimado.ts"/>

/**
 * El objetivo es que cualquier obstáculo de una cuadrícula tenga la misma forma
*/
class Obstaculo extends ActorAnimado {
		esObstaculo;

		constructor(imagenes) {
			super(0, 0, {grilla: this.randomDe(imagenes), cantColumnas:4, cantFilas: 1});
			this.definirAnimacion("parado",new Cuadros(0).repetirVeces(100).concat([1,2,3,3,2,1]),6,true);
			this.esObstaculo = true;
		}

		randomDe(lista){
				 return lista[Math.floor(Math.random()*lista.length)];
		}
}
