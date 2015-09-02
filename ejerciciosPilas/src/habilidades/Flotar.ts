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

    iniciar(){

    }

    actualizar() {
      this.contador += 0.025;
      this.contador = this.contador % 256;
      //Esto es para evitar overflow.
      console.log(this.contador)
      this.receptor.y = this.altura_original + Math.sin(this.contador) * this.desvio

      //this.receptor.sombra.x = this.receptor.x;
      //this.receptor.sombra.y = this.receptor.altura_original - 20;
//      this.receptor.sombra.z = this.receptor.z + 1;
    }










  /*
    class Tuerca extends Actor {
      y_original;
      contador;
      sombra;

      constructor(x, y) {



        this.y_original = y + 20;
        this.x = x + 10;
        this.contador = Math.random() * 3;
        this.sombra = new pilas.actores.Sombra();
        this.sombra.escala = 0.25;
      }

      actualizar() {
        this.contador += 0.025;
        this.y = this.y_original + Math.sin(this.contador) * 5;
        this.sombra.x = this.x;
        this.sombra.y = this.y_original - 20;
        this.sombra.z = this.z + 1;
      }
    }
*/
}
