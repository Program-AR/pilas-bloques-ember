/// <reference path="ActorAnimado.ts"/>

class Hueso extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'actores/actor.Hueso.png', cantColumnas:1, cantFilas: 1});
    }
}
