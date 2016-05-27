/// <reference path="ActorAnimado.ts"/>

class Dracula extends ActorAnimado {
    constructor(x=0, y=0) {
        super(x, y, {grilla: 'dracula.png', cantColumnas:14});
        this.definirAnimacion("bailando", [8,9,10,11,12,13,12,11,10,9], 6);
        this.definirAnimacion("parado", [0], 12, true);
        this.definirAnimacion("aparecer", [0,1,2,3,4,5,6,7], 6);
    }
}
