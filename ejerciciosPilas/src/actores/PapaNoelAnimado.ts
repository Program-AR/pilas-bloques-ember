/// <reference path="ActorAnimado.ts"/>

class PapaNoelAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'papaNoel.png', cantColumnas:11});
        this.definirAnimacion('correr',[0,1,2,3,4,5,6],6);
        this.definirAnimacion('parado',
          new Cuadros([0]).repetirVeces(40).
          concat(new Cuadros([1]).repetirVeces(40)),6,true);
        this.definirAnimacion('recoger',[7,8,9,10,11],6);
        this.definirAnimacion('depositar',[11,10,9,8,7],6);
    }
}
