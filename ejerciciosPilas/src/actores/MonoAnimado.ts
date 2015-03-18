/// <reference path="ActorAnimado.ts"/>

class MonoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'monkey_normal.png', cantColumnas:1, cantFilas: 1});
    }
} 