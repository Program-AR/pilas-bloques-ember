/// <reference path="ActorAnimado.ts"/>

class ManzanaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'manzana.png', cantColumnas:1, cantFilas: 1});
    }
} 