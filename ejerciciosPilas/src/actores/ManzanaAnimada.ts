/// <reference path="ActorAnimado.ts"/>

class ManzanaAnimada extends ActorAnimado {
    constructor(x, y, conSombra=true) {
        super(x, y, {grilla: conSombra ? 'manzanaConSombra.png' : 'manzanaSinSombra.png', cantColumnas:1, cantFilas: 1});
    }
} 