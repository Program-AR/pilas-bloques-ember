/// <reference path = "LaberintoLargo.ts" />
/// <reference path="../actores/RatonAnimado.ts"/>

class LaberintoConQueso extends LaberintoLargo {
  
    iniciar() {
        super.iniciar();
        this.cuadricula.completarConObjetosRandom([QuesoAnimado]);
    }
     dameOpcionesCuadricula(){
      return {'alto':440,'ancho':400};
    }

    nombreFondo(){
      return 'fondo.laberinto.queso.png';
    }    
}
