/// <reference path="ActorAnimado.ts"/>

class Superheroe extends ActorAnimado {
    constructor(x = 0, y = 0) {
        super(x, y, {grilla: 'superheroe.png', cantColumnas:7});
        this.definirAnimacion('parado',new Cuadros([0]).repetirVeces(10).concat([1,0,1,0]),6,true);
        this.definirAnimacion('correr',[2,3,4,5,4,5,4,5,4,3,2,6,6],15);
    }
}
