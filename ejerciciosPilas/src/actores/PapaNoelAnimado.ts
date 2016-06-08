/// <reference path="ActorAnimado.ts"/>

class PapaNoelAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'papaNoel.png', cantColumnas:12});
        this.definirAnimacion('correr',[4,5,6,7,6,5,4],6);
        this.definirAnimacion('parado',
          new Cuadros([0]).repetirVeces(40).
          concat(new Cuadros([2,3,2,1]).repetirVeces(3)),6,true);
        this.definirAnimacion('recoger',[8,9,10,11],6);
        this.definirAnimacion('depositar',[11,10,9,8],6);
    }
}
