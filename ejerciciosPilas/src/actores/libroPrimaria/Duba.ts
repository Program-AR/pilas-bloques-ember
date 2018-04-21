/// <reference path="../ActorAnimado.ts"/>

class Duba extends ActorAnimado {
    constructor() {
			super(0, 0, {grilla: 'actor.duba.png', cantColumnas:1, cantFilas:1});
			this.definirAnimacion("parado",[0],5, true);
			this.definirAnimacion("correr",[0],60);
			this.definirAnimacion("comerChurrasco",[0],12);
    }
}
