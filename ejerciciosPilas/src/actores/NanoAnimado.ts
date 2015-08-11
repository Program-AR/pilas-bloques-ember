/// <reference path="ActorAnimado.ts"/>

class NanoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'nano.png', cantColumnas:1, cantFilas: 1});

    }
}
