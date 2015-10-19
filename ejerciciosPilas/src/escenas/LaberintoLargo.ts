class LaberintoLargo extends Base {
    estado;
    personaje;    cuadricula;    queso; secuenciaCaminata; condicion;
    iniciar() {
        this.estado=undefined;
        this.cuadricula = new CuadriculaParaRaton(0,0,10,10,{'alto':400,'ancho':300},{'->':'casillaDerecha.png','<-':'casillaIzquierda.png','v':'casillaAbajo.png','^':'casillaArriba.png'}).dameCamino();
        this.personaje=new RatonAnimado(0,0)
        this.cuadricula.agregarActor(this.personaje,0,0);
    }

    valorCondicion(argumentos){
      return argumentos.receptor.y > 250;
    }

    personajePrincipal(){
      return this.personaje;
    }

    moverDerecha(){
      this.personaje.hacer_luego(MoverACasillaDerecha);
    }

    moverAbajo(){
      this.personaje.hacer_luego(MoverACasillaAbajo);
    }

}
