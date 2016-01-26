/// <reference path = "EscenaActividad.ts" />
/// <reference path="../comportamientos/RecogerPorEtiqueta.ts"/>
/// <reference path="../actores/cuadriculaEsparsa.ts"/>
/// <reference path="../actores/RatonAnimado.ts"/>
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path="Camino.ts"/>

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
