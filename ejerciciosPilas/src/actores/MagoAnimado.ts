/// <reference path="ActorAnimado.ts"/>

class MagoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'mago.png', cantColumnas:4, cantFilas:2});
        this.definirAnimacion("parado", new Cuadros(1).repetirVeces(16).concat([2,2,2,2,2]), 2, true);
        this.definirAnimacion("darEspada", new Cuadros([1, 3, 4, 5, 5, 6, 6, 7, 7]).repetirVeces(1).concat(new Cuadros(0).repetirVeces(999)), 6);
        this.definirAnimacion("paradoConSombrero", [0], 12);
    }
} 