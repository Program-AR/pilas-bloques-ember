/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>

class SerPateado extends ComportamientoAnimado {
    altura_original
    contador
    aceleracion
    tiempoEnElAire
    elevacionMaxima
  
  preAnimacion() {
        this.receptor.cargarAnimacion("patear")
        this.receptor.aprender(RotarContinuamente, { 'gradosDeAumentoStep': this.argumentos['gradosDeAumentoStep'] || 1 })
        this.actualizarPosicion();
        this.contador = Math.random() * 3;
        this.aceleracion=this.argumentos['aceleracion']
        this.tiempoEnElAire=this.argumentos['tiempoEnElAire']||10
        this.elevacionMaxima=this.argumentos['elevacionMaxima']||10


    }



    doActualizar() {

    super.doActualizar();
  this.patearConSubidaLineal();
    }


    patearConSubidaLineal(){
      this.contador += this.aceleracion;
      this.contador = this.contador % 256;// para evitar overflow
      if(this.receptor.y<this.altura_original+this.elevacionMaxima&&this.tiempoEnElAire>0){
        //subiendo
        this.receptor.y += this.contador;}

      if(this.tiempoEnElAire>0){
        //en el aire
        this.tiempoEnElAire -= 1;
      }

      if(this.tiempoEnElAire<=0){
        //bajando
        if(this.receptor.y>this.altura_original){
            this.receptor.y -= this.contador;}
      }
      this.receptor.x += this.contador;
    }


    patearParaAdelante(){
      this.contador += this.aceleracion;
      this.contador = this.contador % 256;// para evitar overflow
      this.receptor.x += this.contador;
    }

    implicaMovimiento(){
      return true;
    }

    actualizarPosicion(){
      this.altura_original = this.receptor.y
    }

}
