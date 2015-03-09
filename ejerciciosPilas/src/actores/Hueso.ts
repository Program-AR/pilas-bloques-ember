/// <reference path="ActorAnimado.ts"/>

class Hueso extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'hueso.png', cantColumnas:1});
        this.escala_x = 0.05;
        this.escala_y = 0.05;
    }
} 