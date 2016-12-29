/// <reference path="ActorAnimado.ts"/>

class PezAnimado extends ActorAnimado {
    constructor(x, y) {
      super(x, y, {grilla: this.nombrePNG(), cantColumnas:4, cantFilas: 1});
      this.definirAnimacion("parado",new Cuadros(0).repetirRandom(100).concat([1,2,3,3,2,1]),6,true);
      this.definirAnimacion("recoger",[0,1,2,3,2,1],6);
    }

    nombrePNG() {
        if (Math.random() < 1 / 3) return 'pez1.png';
        if (Math.random() < 0.5) return 'pez2.png';
        return 'pez3.png';
    }
}
