/// <reference path="ActorAnimado.ts"/>

class CofreAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'cofre.png', cantColumnas:4});
		this.definirAnimacion("abrir", [0,1,2,3], 15);
        this.definirAnimacion("parado", [0,0,0,1,2,1], 15);
        this.definirAnimacion("abierto", [3,3,3,2,1,2], 15);
    }
}
