/// <reference path="ActorAnimado.ts"/>

class LlaveAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'llave.png', cantColumnas:1});
        this.definirAnimacion("parado", [1], 12);
    }
} 