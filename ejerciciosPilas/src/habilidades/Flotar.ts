/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>

class Flotar extends HabilidadAnimada {
    altura_original
    contador
    desvio

    constructor(receptor,argumentos) {
        super(receptor);
        this.actualizarPosicion();
        this.contador = Math.random() * 3;
        this.desvio = argumentos["Desvio"] || 1;
    }

    actualizar() {
      this.contador += 0.025;
      this.contador = this.contador % 256;
      //Esto es para evitar overflow.
      this.receptor.y = this.altura_original + Math.sin(this.contador) * this.desvio
    }

    implicaMovimiento(){
      return true;
    }

    actualizarPosicion(){
        this.altura_original = this.receptor.y;
    }

}
