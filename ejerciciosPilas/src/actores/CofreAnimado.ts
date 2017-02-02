/// <reference path="ActorAnimado.ts"/>

class CofreAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'cofreAnimado.png', cantColumnas:4});
		this.definirAnimacion("abrir", new Cuadros([0,1,2]).repetirVeces(1).concat(new Cuadros(3).repetirVeces(999)), 3);
        this.definirAnimacion("parado", [0,0,0,0,0,0,0,0,0,0,0,0,2], 1, true);
        this.definirAnimacion("abierto", [3], 4);
    }
}
