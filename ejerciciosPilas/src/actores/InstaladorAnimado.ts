/// <reference path="ActorAnimado.ts"/>

class InstaladorAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'instalador.png', cantColumnas:9, cantFilas: 1});

        this.definirAnimacion("parado",[0],1, true);
        this.definirAnimacion("correr",[1,2,3],5);
        this.definirAnimacion("escribir",[3,4,5,6,7,8,7,8,7,8,7,8],9);
    }

}
