/// <reference path="ActorAnimado.ts"/>

class Robot extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'robot.png', cantColumnas:1, cantFilas: 1});
        
        this.definirAnimacion("caminando",[0],1);
        this.definirAnimacion("parado",[0],1);

    }
} 