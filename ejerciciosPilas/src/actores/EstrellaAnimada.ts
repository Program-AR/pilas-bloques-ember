/// <reference path="ActorAnimado.ts"/>

class EstrellaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'banana-1.png', cantColumnas:1, cantFilas: 1});
        //this.escala_x = 2;
        //this.escala_y = 2;

    }
}
