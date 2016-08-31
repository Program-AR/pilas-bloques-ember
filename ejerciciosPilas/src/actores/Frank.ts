/// <reference path="ActorAnimado.ts"/>

class Frank extends ActorAnimado {
    constructor(x=0, y=0) {
        super(x, y, {grilla: 'frank.png', cantColumnas:10});
        this.definirAnimacion("bailando", [0,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1], 6);
        this.definirAnimacion("parado", new Cuadros([0]).repetirVeces(20).concat([1,2,2,1]), 6, true);
    }
}
