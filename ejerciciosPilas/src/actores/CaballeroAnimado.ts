/// <reference path="ActorAnimado.ts"/>

class CaballeroAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'caballero_oscuro.png', cantColumnas:3});
        this.definirAnimacion("parado", [0,0,0,0,0,1,2,1], 12);
		this.definirAnimacion("defender", [1, 2, 2, 2, 1], 12);
    }
} 