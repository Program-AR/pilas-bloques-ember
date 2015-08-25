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
        if(this.matriz[nroFila][nroColumna]=='T'){
          this.casillas.push(
            new Casilla(nroFila,nroColumna, this));
          }
        }
      }
  }
  completarConObjetosRandom(conjuntoDeClases){
    for(var index=0;index<this.casillas.length;++index){
      if(Math.random()<0.4){
        this.agregarActor(conjuntoDeClases.dameUno(),this.casillas[index].nroFila,this.casillas[index].nroColumna);
      }

    }

  }


  hayDerecha(casilla){
    return (casilla.nroColumna < this.matriz[casilla.nroFila].length+1)
  }

  hayIzquierda(casilla){
    return (casilla.nroColumna+1 > 0)
  }

  hayAbajo(casilla){
    return (casilla.nroFila < this.matriz.length+1)
  }

  hayArriba(casilla){
    return (casilla.nroFila+1 > 0)
  }
/*
 cambiarImagenCasillas(opcionesCasilla){
   for (var index = 0; index < this.matriz.length; ++index) {
     for (var index2 = 0; index2 < this.matriz[0].length; ++index2){
       if(this.matriz[index][index2]=='T'){
         this.casilla(index,index2).cambiarImagen(opcionesCasilla);
      }
     }
    }
  }
*/

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
