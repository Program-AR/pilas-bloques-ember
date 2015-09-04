/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class SerPateado extends Habilidad {
    altura_original
    contador
    aceleracion
    tiempoEnElAire
    elevacionMaxima
  constructor(receptor,argumentos) {
        super(receptor);
        this.receptor.cargarAnimacion("patear")
        this.receptor.aprender(Rotar,{'gradosDeAumentoStep':argumentos['gradosDeAumentoStep']||1})
        this.altura_original=this.receptor.y
        this.contador = Math.random() * 3;
        this.aceleracion=argumentos['aceleracion']
        this.tiempoEnElAire=argumentos['tiempoEnElAire']||10
        this.elevacionMaxima=argumentos['elevacionMaxima']||10


    }



    actualizar() {

      //console.log(this.receptor.x)
      //console.log(this.receptor.y)
      this.patearConSubidaLineal()
    }


    patearConSubidaLineal(){
      this.contador += this.aceleracion
      this.contador = this.contador % 256;// para evitar overflow
      if(this.receptor.y<this.altura_original+this.elevacionMaxima&&this.tiempoEnElAire>0){
        //subiendo
        this.receptor.y += this.contador}

      if(this.tiempoEnElAire>0){
        //en el aire
        this.tiempoEnElAire -=1
      }

      if(this.tiempoEnElAire<=0){
        //bajando
        if(this.receptor.y>this.altura_original){
            this.receptor.y -= this.contador}
      }
      this.receptor.x += this.contador
    }


    patearParaAdelante(){
      this.contador += this.aceleracion
      this.contador = this.contador % 256;// para evitar overflow
      this.receptor.x += this.contador
    }

}
