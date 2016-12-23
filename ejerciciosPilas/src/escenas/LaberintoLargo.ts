/// <reference path = "EscenaActividad.ts" />
/// <reference path = "Camino.ts" />
/// <reference path = "../actores/RatonAnimado.ts" />

class LaberintoLargo extends EscenaActividad {
    estado;
    automata;
    cuadricula;
    fondo;
    iniciar() {
        this.fondo = new Fondo(this.nombreFondo(),0,0);
        this.cuadricula = new CuadriculaParaRaton(0,0,this.cantidadFilas(),this.cantidadColumnas(),this.dameOpcionesCuadricula(),{'->':'casillas/casilla.Derecha.png','<-':'casillas/casilla.Izquierda.png','v':'casillas/casilla.Abajo.png','^':'casillas/casilla.Arriba.png'}).dameCamino();
        this.automata = new RatonAnimado(0,0);
        this.cuadricula.agregarActor(this.automata,0,0);
        this.automata.escala *= 2;
        this.automata.x -= 5;
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
      return 'fondos/fondo.LaberintoLargo.png';
    }

    estaResueltoElProblema(){
      return this.automata.alFinalDelCamino();
    }



}
