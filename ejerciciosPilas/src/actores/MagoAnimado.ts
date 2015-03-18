/// <reference path="ActorAnimado.ts"/>

class MagoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'mock_mago.png', cantColumnas:1});
        //this.escala_x = 0.05;
        //this.escala_y = 0.05;
    }
} 