/// <reference path="ActorAnimado.ts"/>

class MonoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'monoAnimado.png', cantColumnas:19, cantFilas: 1});

        this.definirAnimacion("correr",[0,1,2,3,4,5,6,7],9);
        this.definirAnimacion("parado",new Cuadros(0).repetirVeces(50).concat([0,1,2,3,4]).concat(new Cuadros(4).repetirVeces(30)).concat([4,3,2,1,0]),6, true);
        this.definirAnimacion("comerBanana",[8,9,10,11,12],6);
        this.definirAnimacion("comerManzana", [13,14,15,16,17], 6);
    }




}
