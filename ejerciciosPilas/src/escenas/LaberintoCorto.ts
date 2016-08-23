/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../escenas/LaberintoLargo.ts"/>


class LaberintoCorto extends LaberintoLargo {
    fondo;
    automata;
    cuadricula;
    aDerecha;
    iniciar(){
      this.aDerecha = Math.random() < 0.5;
      super.iniciar();
    }

    cantidadFilas(){
      return this.aDerecha ? 1 : 2;
    }
    cantidadColumnas(){
      return this.aDerecha ? 2 : 1;
    }

    nombreFondo(){
      return 'fondo.laberinto.corto.png';
    }
    dameOpcionesCuadricula(){
      return {'alto':200,'ancho':200};
    }
}
