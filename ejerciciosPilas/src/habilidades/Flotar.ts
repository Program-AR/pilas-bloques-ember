/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class Flotar extends Habilidad {
    altura_original
    contador
    desvio

    constructor(receptor,argumentos) {
        super(receptor);
        this.altura_original=this.receptor.y
        this.contador = Math.random() * 3;
        console.log(this.contador)
        console.log(this.receptor.y)
        this.desvio = argumentos["Desvio"];
    }

    actualizar() {
      this.contador += 0.025;
      this.contador = this.contador % 256;
      //Esto es para evitar overflow.
      console.log(this.contador)
      this.receptor.y = this.altura_original + Math.sin(this.contador) * this.desvio
    }

}
