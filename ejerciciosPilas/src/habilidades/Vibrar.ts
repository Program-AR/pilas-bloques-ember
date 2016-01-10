/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>

/*Si los grados de aumento son positivos gira para la derecha
caso contrario gira para la izquierda*/


class Vibrar extends HabilidadAnimada {
  gradosDeAumentoStep
  tiempoVibracion
  izquierda
  tiempoAEmplear
  enPause;
  constructor(receptor,argumentos) {
        super(receptor);
        this.gradosDeAumentoStep=argumentos['gradosDeAumentoStep']||1
        this.tiempoVibracion=argumentos['tiempoVibracion']||2
        this.izquierda=true;
        this.tiempoAEmplear=this.tiempoVibracion
        this.enPause=true;
    }

    actualizar() {
/*
      if(this.tiempoVibracion>0){
        this.tiempoVibracion--;
      }*/
      if(this.enPause){
          this.tiempoAEmplear--;
          if(this.tiempoAEmplear<0){
            this.enPause=false;
            this.tiempoAEmplear=this.tiempoVibracion;

          }

      }else{
      if(this.izquierda){
        this.receptor.rotacion += this.gradosDeAumentoStep;
        this.tiempoAEmplear--;
        if(this.tiempoAEmplear<0){
            this.izquierda=false;
            this.tiempoAEmplear=this.tiempoVibracion
        }
      }
      else{
        this.receptor.rotacion -= this.gradosDeAumentoStep;
        this.tiempoAEmplear--;
        if(this.tiempoAEmplear<0){
            this.izquierda=true;
            this.tiempoAEmplear=this.tiempoVibracion
            this.enPause=true;
        }
      }

}

    }




}
