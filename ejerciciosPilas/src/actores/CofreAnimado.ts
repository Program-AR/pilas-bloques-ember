/// <reference path="ActorAnimado.ts"/>

class CofreAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'cofreAnimado.png', cantColumnas:4});
		this.definirAnimacion("abrir", [0,1,2,3], 6);
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(50).concat([1,2,1]), 4, true);
        this.definirAnimacion("abierto", new Cuadros(3).repetirVeces(50).concat([2,1,2]), 4);
    }
}
