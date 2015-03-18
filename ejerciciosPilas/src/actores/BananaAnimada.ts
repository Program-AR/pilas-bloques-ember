/// <reference path="ActorAnimado.ts"/>

class BananaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'banana.png', cantColumnas:1, cantFilas: 1});
    }
} 