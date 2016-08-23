/// <reference path="ActorAnimado.ts"/>

class Bruja extends ActorAnimado {
    constructor(x=0, y=0) {
        super(x, y, {grilla: 'bruja.png', cantColumnas:16});
        this.definirAnimacion("bailando", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1], 6);
        this.definirAnimacion("parado", new Cuadros([0]).repetirVeces(30).concat([1,5,5,5,5,1]), 6, true);
    }
}
