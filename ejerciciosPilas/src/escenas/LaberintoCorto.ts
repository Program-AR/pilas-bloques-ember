/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../escenas/LaberintoLargo.ts"/>


class LaberintoCorto extends LaberintoLargo {
    fondo;
    automata;
    cuadricula;
    caso;
    iniciar(){
      this.caso = Math.random() < 0.5;
      super.iniciar();
    }

    cantidadFilas(){
      return this.caso ? 1 : 2;
    }
    cantidadColumnas(){
      return this.caso ? 2 : 1;
    }

    nombreFondo(){
      return 'fondo.laberinto.corto.png';
    }
    dameOpcionesCuadricula(){
      return {'alto':200,'ancho':200};
    }
}
