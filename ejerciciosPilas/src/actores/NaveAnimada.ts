/// <reference path="ActorAnimado.ts"/>

class NaveAnimada extends ActorAnimado {
    constructor(x = 0, y = 0) {
        super(x, y, {grilla: 'naveAnimada.png', cantColumnas:4, cantFilas: 1});
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(30).concat([1]), 4, true);
        this.definirAnimacion("correr", new Cuadros([0, 1, 2]).repetirVeces(1).concat(new Cuadros(3).repetirVeces(100)), 6);
    }
}
