/// <reference path="ActorAnimado.ts"/>
 class SandiaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'actores/actor.Sandia.png', cantColumnas:5, cantFilas: 1});
        this.definirAnimacion("comerse",[0,1,2,3,4],6);
        this.definirAnimacion("mordida", [4], 1);
    }

}
