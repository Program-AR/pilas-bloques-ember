/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>

class Flotar extends HabilidadAnimada {
    altura_original
    contador
    desvio
    eje

    constructor(receptor,argumentos) {
        super(receptor);
        this.contador = Math.random() * 3;
        this.desvio = argumentos["Desvio"] || 1;
        this.eje = argumentos.eje || 'Y';
        this.actualizarPosicion();
    }

    actualizar() {
      this.contador += 0.025;
      this.contador = this.contador % 256;
      //Esto es para evitar overflow.
      this.receptor['set' + this.eje](this.altura_original + Math.sin(this.contador) * this.desvio);
    }

    implicaMovimiento(){
      return true;
    }

    actualizarPosicion(){
        this.altura_original = this.receptor['get' + this.eje]();
    }

}
