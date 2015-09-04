/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class Flotar extends Habilidad {
    altura_original
    contador
    desvio

    constructor(receptor,argumentos) {
        super(receptor);
        this.altura_original=this.receptor.y
        this.contador = Math.random() * 3;
        this.desvio = argumentos["Desvio"] || 1;
    }

    actualizar() {
      this.contador += 0.025;
      this.contador = this.contador % 256;
      //Esto es para evitar overflow.
      this.receptor.y = this.altura_original + Math.sin(this.contador) * this.desvio
    }

}
