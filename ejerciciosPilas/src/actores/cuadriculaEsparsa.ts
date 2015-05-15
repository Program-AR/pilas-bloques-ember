/// <reference path="../comportamientos/movimientosEnCuadricula.ts"/>
/// <reference path="Cuadricula.ts"/>

class CuadriculaEsparsa extends Cuadricula{
  matriz;
  constructor(x,y,cantidadFilasMax,cantidadColumnasMax,opcionesCuadricula,opcionesCasilla,matriz){
    this.matriz=matriz;
    super(x,y,cantidadFilasMax,cantidadColumnasMax,opcionesCuadricula,opcionesCasilla);
  }

  crearCasillas(){
    this.casillas = new Array<Casilla>();
    for(var nroFila=0; nroFila < this.cantFilas; nroFila++){
      for(var nroColumna=0; nroColumna < this.cantColumnas; nroColumna++){
        if(this.matriz[nroFila][nroColumna]){
          this.casillas.push(
            new Casilla(nroFila,nroColumna, this));
          }
        }
      }
  }

  construimeCaminoAleatorioEntre(inicioX,inicioY,finX,finY){
      //TODO: falta implementar
  }

  hayDerecha(casilla){
    return this.matriz[casilla.nroFila][casilla.nroColumna+1]
    //si no esta en rango devuelve undefined, lo cual se interpretara
    //como false
  }

  hayIzquierda(casilla){
    return this.matriz[casilla.nroFila][casilla.nroColumna-1]
  }

  hayAbajo(casilla){
    return this.matriz[casilla.nroFila+1][casilla.nroColumna]

  }

  hayArriba(casilla){
    return this.matriz[casilla.nroFila-1][casilla.nroColumna]
  }

}


class MoverACasillaDerechaEsparsa extends MoverACasillaDerecha {
  proximaCasilla(casilla){
  if (casilla.cuadricula.hayDerecha(casilla)){
    return casilla.casillaASuDerecha();
  }else{
    return undefined;
  }
}
}

class MoverACasillaIzquierdaEsparsa extends MoverACasillaIzquierda {
  proximaCasilla(casilla){
  if (casilla.cuadricula.hayIzquierda(casilla)){
    return casilla.casillaASuIzquierda();
  }else{
    return undefined;
  }
}
}
class MoverACasillaArribaEsparsa extends MoverACasillaArriba {
  proximaCasilla(casilla){
  if (casilla.cuadricula.hayArriba(casilla)){
    return casilla.casillaDeArriba();
  }else{
    return undefined;
  }
}
}
class MoverACasillaAbajoEsparsa extends MoverACasillaAbajo {
  proximaCasilla(casilla){
  if (casilla.cuadricula.hayAbajo(casilla)){
    return casilla.casillaDeAbajo();
  }else{
    return undefined;
  }
}
}
