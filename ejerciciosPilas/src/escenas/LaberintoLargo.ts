/// <reference path = "EscenaActividad.ts" />

class LaberintoLargo extends EscenaActividad {
    estado;
    automata;    cuadricula;    queso; secuenciaCaminata; condicion;
    fondo;
    nombreFondo='fondo.laberinto.largo.png';
    cantidadFilas=10;
    cantidadColumnas=10;



    iniciar() {
        this.estado=undefined;
        this.fondo = new Fondo(this.nombreFondo,0,0);
        this.cuadricula = new CuadriculaParaRaton(0,0,this.cantidadFilas,this.cantidadColumnas,{'alto':400,'ancho':300},{'->':'casillaDerecha.png','<-':'casillaIzquierda.png','v':'casillaAbajo.png','^':'casillaArriba.png'}).dameCamino();
        this.automata = new RatonAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata,0,0);
    }

    estaResueltoElProblema(){
      return this.automata.alFinalDelCamino();
    }

    valorCondicion(argumentos){
      return argumentos.receptor.y > 250;
    }

}
