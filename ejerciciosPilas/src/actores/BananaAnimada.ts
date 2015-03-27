/// <reference path="ActorAnimado.ts"/>

class BananaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'banana.png', cantColumnas:2, cantFilas: 1});
        this.escala_x = 2;
        this.escala_y = 2;
    }
} 