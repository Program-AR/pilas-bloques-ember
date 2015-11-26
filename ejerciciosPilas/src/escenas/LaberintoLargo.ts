/// <reference path = "EscenaActividad.ts" />

class LaberintoLargo extends EscenaActividad {
    estado;
    automata;    cuadricula;    queso; secuenciaCaminata; condicion;
    iniciar() {
        this.estado=undefined;
        this.cuadricula = new CuadriculaParaRaton(0,0,10,10,{'alto':400,'ancho':300},{'->':'casillaDerecha.png','<-':'casillaIzquierda.png','v':'casillaAbajo.png','^':'casillaArriba.png'}).dameCamino();
        this.automata=new RatonAnimado(0,0)
        this.cuadricula.agregarActor(this.automata,0,0);
    }

    valorCondicion(argumentos){
      return argumentos.receptor.y > 250;
    }

    personajePrincipal(){
      return this.automata;
    }

    moverDerecha(){
      this.automata.hacer_luego(MoverACasillaDerecha);
    }

    moverAbajo(){
      this.automata.hacer_luego(MoverACasillaAbajo);
    }

}
