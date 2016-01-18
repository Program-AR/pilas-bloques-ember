/// <reference path="ActorAnimado.ts"/>

class AlienAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'alienAnimado.png', cantColumnas:14});
        this.definirAnimacion("parado", new Cuadros(13).repetirVeces(50).concat([12, 13, 11, 12, 11, 13]).concat(new Cuadros(13).repetirVeces(30)).concat([9,9,9,9,8,8,8,8,8,8,8,8,8,8]), 4, true);
    	this.definirAnimacion("hablar", [12, 13, 11, 12, 11, 13], 15);
    	this.definirAnimacion("recoger", [12, 10, 10, 12], 6);
    	this.definirAnimacion("correr", [0, 1, 2, 3, 4, 3, 2, 1], 20);
        this.definirAnimacion("apretar",[12,6,5,5,5,5,5,6,12,13],6);
        this.definirAnimacion("SerAnimado", [0, 1, 2, 3, 4, 3, 2, 1], 20);


    }



}
