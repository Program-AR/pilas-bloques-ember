/// <reference path="ActorAnimado.ts"/>

class RegaloAnimado extends ActorAnimado {
    constructor(x=0, y=0) {
        super(x, y, {grilla: 'regaloAnimado.png', cantColumnas:1, cantFilas: 1});
    }
}
