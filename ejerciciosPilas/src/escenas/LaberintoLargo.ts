/// <reference path = "EscenaActividad.ts" />

class LaberintoLargo extends EscenaActividad {
    estado;
    automata;    cuadricula;    queso; secuenciaCaminata; condicion;
    fondo;



    iniciar() {
        this.estado=undefined;
        this.fondo = new Fondo('fondo.laberinto.largo.png',0,0);
        this.cuadricula = new CuadriculaParaRaton(0,0,8,8,{'alto':440,'ancho':400},{'->':'casillaDerecha.png','<-':'casillaIzquierda.png','v':'casillaAbajo.png','^':'casillaArriba.png'}).dameCamino();
        this.automata = new RatonAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata,0,0);
        this.automata.escala *= 1.6;
    }

    estaResueltoElProblema(){
      return this.automata.alFinalDelCamino();
    }

    valorCondicion(argumentos){
      return argumentos.receptor.y > 250;
    }

}
