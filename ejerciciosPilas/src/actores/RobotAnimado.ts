/// <reference path="ActorAnimado.ts"/>

class RobotAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'robotAnimado.png', cantColumnas:13});
        this.definirAnimacion("correr",[0,1,2,3,4,5],6);
        this.definirAnimacion("patear",[8,9,10,11,12,11,10,9,8],6);

    }

}
