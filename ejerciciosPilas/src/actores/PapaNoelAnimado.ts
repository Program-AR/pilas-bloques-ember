/// <reference path="ActorAnimado.ts"/>

class PapaNoelAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'papaNoel.png', cantColumnas:11});
        this.definirAnimacion('correr',[0,1,2,3,2,1],6);
        this.definirAnimacion('parado',
          new Cuadros([0,6,5]).repetirVeces(1).
          concat(new Cuadros([5]).repetirVeces(20).
          concat([5,6,0]).
          concat(new Cuadros([0]).repetirVeces(20))),6,true);
        this.definirAnimacion('recoger',[7,8,9,10,11],6);
        this.definirAnimacion('depositar',[11,10,9,8,7],6);
    }
}
