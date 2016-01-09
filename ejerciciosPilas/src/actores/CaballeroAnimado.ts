/// <reference path="ActorAnimado.ts"/>

class CaballeroAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'caballero_oscuro.png', cantColumnas:3});
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(95).concat([1,2,1]), 6, true);
		this.definirAnimacion("defender", [1,2,2,2,2,2,2,1], 6);
    }
} 