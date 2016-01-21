/// <reference path="ActorAnimado.ts"/>

class Princesa extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'princesa.png', cantColumnas:2});
        this.definirAnimacion("parado", new Cuadros(1).repetirVeces(20).concat([0,0,0,0]), 2, true);
		this.definirAnimacion("correr", [0], 6);
    }
} 