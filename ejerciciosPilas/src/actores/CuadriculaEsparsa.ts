/// <reference path="../comportamientos/MovimientosEnCuadricula.ts"/>
/// <reference path="Cuadricula.ts"/>

/*

Implementa una cuadrícula donde no están todas las casillas, permitiendo generar
diseños más complejos que un cuadrado, pero reutilizando el comportamiento de la
cuadrícula y sus movimientos.

*/
class CuadriculaEsparsa extends Cuadricula{
  matriz;
  constructor(x,y,opcionesCuadricula,opcionesCasilla,matriz){
    this.matriz=matriz;
    super(x,y,matriz.length,matriz[0].length,opcionesCuadricula,opcionesCasilla);
  }

  agregarCasilla(nroFila,nroColumna){
    /*Crea las casillas definidas por la matriz booleana
    definida ene l constructor*/
    if(this.matriz[nroFila][nroColumna]=='T'){
			super.agregarCasilla(nroFila,nroColumna);
		}
  }

  completarConObjetosRandom(conjuntoDeClases, argumentos = {condiciones: []}){
    /*Completa la cuadricula esparsa con objetos random
    Opcionalmente se le puede pasar a argumentos.condiciones
    una lista de funciones que seran evaluadas de manera de evitar
    que en determinadas posiciones de la cuadricula se agreguen objetos.*/
    if (argumentos.condiciones === undefined) {
      argumentos.condiciones = [];
    }
    this.forEachCasilla((casilla) => {
      if (Math.random() < 0.6 && argumentos.condiciones.every((condicion) => condicion(casilla))) {
        this.agregarActor(conjuntoDeClases.dameUno(), casilla.nroFila, casilla.nroColumna);
      }
    });
  }

  hayDerecha(casilla){
    /*Devuelve true sii existe una casilla
    a la inmediata derecha de la casilla */
    return this.casilla(casilla.nroFila,casilla.nroColumna+1)!=undefined;
  }

  hayIzquierda(casilla){
    return this.casilla(casilla.nroFila,casilla.nroColumna-1)!=undefined;
  }

  hayAbajo(casilla){
    return this.casilla(casilla.nroFila+1,casilla.nroColumna)!=undefined;
  }

  hayArriba(casilla){
    return this.casilla(casilla.nroFila-1,casilla.nroColumna)!=undefined;
  }

}
