/// <reference path="ActorAnimado.ts"/>

class HeroeAnimado extends ActorAnimado {
    constructor(x = 0, y = 0) {
        super(x, y, {grilla: this.nombreArchivo(), cantColumnas:6, cantFilas: 5});
        this.definirAnimacion("correr",[0,1,2,3,4,5],6);
        this.definirAnimacion("parado",[0],6, true);
        this.definirAnimacion("agarrarSombrero",[15,14,13,12,12,12,12],6);
        this.definirAnimacion("cambiarSombreroPorEspada",[12,13,14,15,4,4,4,4,4,4,9,8,7,6],6);
        this.definirAnimacion("correrConEspada",[6,7,8,9,10,11],12);
        this.definirAnimacion("correrConSombrero", [12,13,14,15,16,17], 12);
        this.definirAnimacion("atacar", new Cuadros([24,25,26,27,28,29]).repetirVeces(3), 6);
    }

    nombreArchivo(){
      return 'heroe.png';
    }
}

class Heroina extends HeroeAnimado {
  nombreArchivo(){
    return 'heroina.png';
  }
}
