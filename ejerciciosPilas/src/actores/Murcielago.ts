/// <reference path="ActorAnimado.ts"/>

class Murcielago extends ActorAnimado {
    constructor(x=0, y=0) {
        super(x, y, {grilla: 'murcielago.png', cantColumnas:4});
        this.definirAnimacion("parado",[0,1,2,3,2,1],12,true);
    }
}
