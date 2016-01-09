/// <reference path="ActorAnimado.ts"/>

class MagoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'mago.png', cantColumnas:4, cantFilas:2});
        this.definirAnimacion("parado", [1], 12,true);
        this.definirAnimacion("darEspada", [1,2,3,5,5,6,6,7,7], 6);
        this.definirAnimacion("paradoConSombrero", [0], 12);
    }
} 