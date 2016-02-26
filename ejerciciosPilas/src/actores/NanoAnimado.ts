/// <reference path="ActorAnimado.ts"/>

class NanoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'nano.png', cantColumnas:4, cantFilas: 1});
        this.definirAnimacion('parado', [0], 6, true);
        this.definirAnimacion('correr', [0,1,2,1,2,1,2,1,2,1,2], 9);
        this.definirAnimacion('recoger', [0], 6);
    }
}
