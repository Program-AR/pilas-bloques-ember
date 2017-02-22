/// <reference path="../ActorAnimado.ts"/>

class Duba extends ActorAnimado {
    constructor() {
				super(0, 0, {grilla: 'actor.duba.png', cantColumnas:10, cantFilas: 2});
				this.definirAnimacion("parado",[0,0,0],15, true);
				this.definirAnimacion("correr",[0,1,2,3,4,5],12);
				this.definirAnimacion("comerChurrasco",[11,12,13,14,15,16,17,18,19],10);
    }
}
