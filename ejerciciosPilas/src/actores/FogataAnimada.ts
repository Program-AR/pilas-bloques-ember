/// <reference path="ActorAnimado.ts"/>

class FogataAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'actores/actor.Fogata2.png', cantColumnas:12, cantFilas: 1});
        this.definirAnimacion("parado",[0],5);
        this.definirAnimacion("prendida",[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],5);
    }
}
