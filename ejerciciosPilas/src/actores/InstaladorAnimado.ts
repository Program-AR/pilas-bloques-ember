/// <reference path="ActorAnimado.ts"/>

class InstaladorAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'instalador.png', cantColumnas:6, cantFilas: 1});

        this.definirAnimacion("parado",[0],15, true);
        this.definirAnimacion("correr",[1,2,3],5);
        this.definirAnimacion("escribir",[1,5,1,5,1,5],6);
    }

}
