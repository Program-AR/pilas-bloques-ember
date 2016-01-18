/// <reference path="ActorAnimado.ts"/>

class CofreAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'cofreAnimado.png', cantColumnas:4});
		this.definirAnimacion("abrir", [0,1,2,3], 3);
        this.definirAnimacion("parado", [0,0,0,0,0,0,0,0,0,0,0,0,2], 1, true);
        this.definirAnimacion("abierto", [3], 4);
    }
}
