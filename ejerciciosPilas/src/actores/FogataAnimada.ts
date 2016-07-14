/// <reference path="ActorAnimado.ts"/>

class FogataAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'actor.Fogata.png', cantColumnas:3, cantFilas: 1});
        this.definirAnimacion("parado",[0],5);
        this.definirAnimacion("prendida",[1, 2],5);
    }
}
