/// <reference path="ActorAnimado.ts"/>

class LlaveAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'mock_llave.png', cantColumnas:1});
        //this.escala_x = 1;
        //this.escala_y = 1;
    }
} 