/// <reference path="ActorAnimado.ts"/>

class UnicornioAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'unicornio.png', cantColumnas:5, cantFilas:2});
        this.definirAnimacion("parado", [0,0,0,0,1,2,3,4,3], 12);
        this.definirAnimacion("correr", [5,6,7,8,9], 12);
    }
} 