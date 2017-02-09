/// <reference path="ActorAnimado.ts"/>

class InstaladorAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'instalador.png', cantColumnas:9, cantFilas: 1});

        this.definirAnimacion("parado",[0],1, true);
        this.definirAnimacion("correr",[0,3,2,1,2,3],10);
				this.definirAnimacion("escribir",[3,4,5,6,7,8,7,8,7,6,5,4],9);
    }

}
