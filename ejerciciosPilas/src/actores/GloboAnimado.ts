/// <reference path="ActorAnimado.ts"/>

class GloboAnimado extends ActorAnimado {
    constructor(x=0, y=0) {
        super(x, y, {grilla: 'globoAnimado.png', cantColumnas:3, cantFilas: 1});
        this.definirAnimacion("explotar", [0, 0, 0, 1, 2, 2], 6);
    }
}
