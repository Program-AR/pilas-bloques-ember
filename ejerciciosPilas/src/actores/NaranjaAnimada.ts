/// <reference path="ActorAnimado.ts"/>
 class NaranjaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'naranja.png', cantColumnas:1, cantFilas: 1});
        this.definirAnimacion("comerse",[0],6);
        this.definirAnimacion("mordida", [0], 1);
    }

}
