class AlienAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'alien.png', cantColumnas:14});
        this.definirAnimacion("correr",[0,1,2,3,4],5);
        this.definirAnimacion("apretar",[5,6,7],3);

    }



}
