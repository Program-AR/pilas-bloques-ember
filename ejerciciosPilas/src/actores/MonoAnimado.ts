/// <reference path="ActorAnimado.ts"/>

class MonoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'monoAnimado.png', cantColumnas:10, cantFilas: 1});

        this.definirAnimacion("correr",[0,1,2,3,4,5,6,7],12);
        this.definirAnimacion("parado",new Cuadros(0).repetirVeces(50).concat([0,1,2,3,4]).concat(new Cuadros(4).repetirVeces(30)).concat([4,3,2,1,0]),6, true);
        this.definirAnimacion("recoger",[9,7,8,8,9],6);
        this.definirAnimacion("contar",[9,7,8,8,9],6);
    }




}
