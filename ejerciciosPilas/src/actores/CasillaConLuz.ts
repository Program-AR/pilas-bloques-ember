/// <reference path="ActorAnimado.ts"/>

class CasillaConLuz extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'casilla_con_luz.png', cantColumnas:2, cantFilas: 1});
        
        this.definirAnimacion("apagada",[0],1);
        this.definirAnimacion("prendida",[1],1);

    }
} 