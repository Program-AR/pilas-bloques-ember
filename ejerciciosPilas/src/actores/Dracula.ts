/// <reference path="ActorAnimado.ts"/>

class Dracula extends ActorAnimado {
    constructor(x=0, y=0) {
        super(x, y, {grilla: 'dracula.png', cantColumnas:15});
        this.definirAnimacion("bailando", [9,10,11,12,13,14,13,12,11,10], 6);
        this.definirAnimacion("parado", [0], 12, true);
        this.definirAnimacion("aparecer", [0,1,2,3,4,5,6,7,8], 6);
    }
}
