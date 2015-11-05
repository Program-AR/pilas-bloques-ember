/// <reference path="ActorAnimado.ts"/>

class GatoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'gatoAnimado.png', cantColumnas:7, cantFilas: 7});
        this.definirAnimacion("saludar",[4,6,4],5);
        this.definirAnimacion("acostado",[4,6,4],5);
        this.definirAnimacion("parado",[4,6,4],5);
        this.definirAnimacion("abrirOjos",[4,6,4],5);
        this.definirAnimacion("cerrarOjos",[4,6,4],5);
        this.definirAnimacion("correr",[0,1,2,3,4,5],6);
    }
}
