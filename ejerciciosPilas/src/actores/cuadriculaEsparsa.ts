/// <reference path="../comportamientos/MovimientosEnCuadricula.ts"/>
/// <reference path="Cuadricula.ts"/>

class CuadriculaEsparsa extends Cuadricula{
  matriz;
  constructor(x,y,cantidadFilasMax,cantidadColumnasMax,opcionesCuadricula,opcionesCasilla,matriz){
    this.matriz=matriz;
    super(x,y,cantidadFilasMax,cantidadColumnasMax,opcionesCuadricula,opcionesCasilla);
  }

  crearCasillas(){
    /*Crea las casillas definidas por la matriz booleana
    definida ene l constructor*/
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

  completarConObjetosRandom(conjuntoDeClases,argumentos){
    /*Completa la cuadricula esparsa con objetos random
    Opcionalmente se le puede pasar a argumentos.condiciones
    una lista de funciones que seran evaluadas de manera de evitar
    que en determinadas posiciones de la cuadricula se agreguen objetos.*/
    for(var index=0;index<this.casillas.length;++index){
      if(Math.random()<0.6&&this.sonTodosTrue(argumentos.condiciones,this.casillas[index].nroFila,this.casillas[index].nroColumna,this.matriz)){
        this.agregarActor(conjuntoDeClases.dameUno(),this.casillas[index].nroFila,this.casillas[index].nroColumna);
      }
    }
  }

  sonTodosTrue(condiciones,fila,col,pmatrix){
    /*Toma una lista de funciones y les aplica
    fila, col. */
    if (condiciones!=undefined){
      for(var i =0;i<condiciones.length;++i){
        if (!condiciones[i](fila,col,pmatrix)){
          return false;
        }
      }
    }
    return true;
  }

  hayDerecha(casilla){
    /*Devuelve true sii existe una casilla
    a la inmediata derecha de la casilla */
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
