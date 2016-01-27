/// <reference path = "EscenaActividad.ts" />
/// <reference path = "Camino.ts" />
/// <reference path = "../actores/RatonAnimado.ts" />

class LaberintoLargo extends EscenaActividad {
    estado;
    automata;
    cuadricula;
    fondo;
    iniciar() {
        this.estado=undefined;
        this.fondo = new Fondo(this.nombreFondo(),0,0);
        this.cuadricula = new CuadriculaParaRaton(0,0,this.cantidadFilas(),this.cantidadColumnas(),this.dameOpcionesCuadricula(),{'->':'casillaDerecha.png','<-':'casillaIzquierda.png','v':'casillaAbajo.png','^':'casillaArriba.png'}).dameCamino();
        this.automata = new RatonAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata,0,0);
        this.automata.escala *= 1.6;
    }

    dameOpcionesCuadricula(){
      return {'alto':440,'ancho':400};
    }

    cantidadFilas(){
      return 8;
    }
    cantidadColumnas(){
      return 8;
    }
    nombreFondo(){
      return 'fondo.laberinto.largo.png';
    }

    estaResueltoElProblema(){
      return this.automata.alFinalDelCamino();
    }



}
