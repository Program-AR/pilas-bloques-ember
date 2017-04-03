/// <reference path="../ActorAnimado.ts"/>

class Coty extends ActorAnimado {
    constructor() {
				super(0, 0, {grilla: 'actor.coty.png', cantColumnas:6, cantFilas: 3});
				this.definirAnimacion("parado",[7,7,7,7,7,7,7,7,7,8,8],12, true);
				this.definirAnimacion("arriba",[3,4,5,4],12);
        this.definirAnimacion("correr",[9,10,11,10],12);
        this.definirAnimacion("abajo",[3,4,5,4],12);
        this.definirAnimacion("arribaDibujando",[0,1,2,1],12);
        this.definirAnimacion("correrDibujando",[6,7,8,7],12);
        this.definirAnimacion("abajoDibujando",[12,13,14,13],12);
    }
}
