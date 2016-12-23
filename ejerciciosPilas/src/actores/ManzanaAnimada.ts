/// <reference path="ActorAnimado.ts"/>

class ManzanaAnimada extends ActorAnimado {
    constructor(x, y, conSombra=true) {
        super(x, y, {grilla: conSombra ? 'actores/actor.ManzanaConSombra.png' : 'actores/actor.ManzanaSinSombra.png', cantColumnas:1, cantFilas: 1});
    }
}
