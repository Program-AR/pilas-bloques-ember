/// <reference path="ActorAnimado.ts"/>
 class SandiaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'sandia.png', cantColumnas:1, cantFilas: 1});

        this.escala_x = 2;
        this.escala_y = 2;
        this.definirAnimacion("mordida",[1],1);


    }

}
