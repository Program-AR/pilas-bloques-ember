/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "Camino.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../escenas/LaberintoLargo.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>



class LaberintoCorto extends LaberintoLargo {
    fondo;
    automata;
    cuadricula;
    caso;
    iniciar(){
      if(Math.random()<0.5){
          this.caso=true;
      }else{
          this.caso=false;
      }
      super.iniciar();
    }

    cantidadFilas(){
      if(this.caso){
        return 1;
      }else{
        return 2;
      }
    }
    cantidadColumnas(){
      if(this.caso){
        return 2;
      }else{
        return 1;
      }
    }
    nombreFondo(){
      return 'fondo.laberinto.corto.png';
    }
    dameOpcionesCuadricula(){
      return {'alto':200,'ancho':200};
    }
}
