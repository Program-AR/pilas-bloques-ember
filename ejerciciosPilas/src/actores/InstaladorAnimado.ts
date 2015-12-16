/// <reference path="ActorAnimado.ts"/>

class InstaladorAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'instalador.png', cantColumnas:6, cantFilas: 1});

        this.definirAnimacion("correr",[0],15);
        this.definirAnimacion("parado",[1,2,3],5);
        this.definirAnimacion("escribir",[4],10);
    }

}
