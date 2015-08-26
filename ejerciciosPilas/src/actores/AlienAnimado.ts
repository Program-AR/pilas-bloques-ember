class AlienAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'alien.png', cantColumnas:14});
        this.definirAnimacion("parado", [11, 12, 6, 12, 13], 5);
    	this.definirAnimacion("hablar", [12, 13, 11, 12, 11, 13], 15);
    	this.definirAnimacion("recoger", [12, 10, 10, 10, 10, 12], 5);
    	this.definirAnimacion("correr", [0, 1, 2, 3, 4, 3, 2, 1], 20);
        this.definirAnimacion("apretar",[12,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,12,13],3);

    }



}
