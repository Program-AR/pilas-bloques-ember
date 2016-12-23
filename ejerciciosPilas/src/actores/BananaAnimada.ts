/// <reference path="ActorAnimado.ts"/>

class BananaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'actores/actor.Banana.png', cantColumnas:1, cantFilas: 1});
    }
}
