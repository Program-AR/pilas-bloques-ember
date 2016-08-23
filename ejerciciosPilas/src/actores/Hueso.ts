/// <reference path="ActorAnimado.ts"/>

class Hueso extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'hueso.png', cantColumnas:1, cantFilas: 1});
    }
} 