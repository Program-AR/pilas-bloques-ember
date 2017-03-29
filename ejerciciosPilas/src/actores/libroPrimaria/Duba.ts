/// <reference path="../ActorAnimado.ts"/>

class Duba extends ActorAnimado {
    constructor() {
				super(0, 0, {grilla: 'actor.duba.png', cantColumnas:2, cantFilas: 6});
				this.definirAnimacion("parado",[0],5, true);
				this.definirAnimacion("correr",[0,1,2,3,4,5,6,7,6,5,4,3,2,1],60);
				this.definirAnimacion("comerChurrasco",[8,9,10,11,11,11,10,9],12);
    }
}
