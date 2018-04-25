/// <reference path="../ActorAnimado.ts"/>

class Duba extends ActorAnimado {
    constructor() {
			super(0, 0, {grilla: 'actor.duba.png', cantColumnas:5, cantFilas:4});
			this.definirAnimacion("parado",[0,1,2,3,4,5,6,7,8,9,10,9,8,7,6,5,4,3,2,1],10, true);
			this.definirAnimacion("correr",[0],60);
			this.definirAnimacion("comerChurrasco",[0],12);
    }
}
