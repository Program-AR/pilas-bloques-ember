/// <reference path="ActorAnimado.ts"/>

class NaveAnimada extends ActorAnimado {
    constructor(x = 0, y = 0) {
        super(x, y, {grilla: 'naveAnimada.png', cantColumnas:4, cantFilas: 1});
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(30).concat([1]), 4, true);
        this.definirAnimacion("correr", [0, 1, 0, 1, 0, 1, 0, 1, 2, 3, 2, 3, 3, 3, 2], 6);
    }
}
