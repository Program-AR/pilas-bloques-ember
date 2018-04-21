/*

1. La clase implementa una matriz donde cada fila tiene una cantidad distinta de columnas.

2. Cada fila es una cuadricula

3. Se permite inicializar con tamaños random o con tamaños fijos.

4. También, dado un definidor de Columnas (ver clase de este archivo), permite inicializar
esta matriz con objetos de esos tipos de manera aleatoria.

5. Se provee el método posicionar objeto que reemplaza al agregarActor tradicional

6. Para un ejemplo de utilizacion ver ElMonoQueSabeContar.ts

*/


/// <reference path = "../actores/CuadriculaEsparsa.ts"/>

// TODO: DEBERIAMOS HACER REFACTOR de manera de mergear constructores/clases.

class CuadriculaMultipleColumnas extends CuadriculaEsparsa{
  pmatrix;
  constructor(definidor,x,y,opcionesCuadricula,opcionesCasilla){
    this.cantFilas = definidor.dameMaximo();
    this.cantColumnas = definidor.size();
    this.pmatrix = new Array(this.cantFilas,Array(this.cantColumnas));
    //this.pmatrix =  String[cantidadFilas][cantidadColumnas];
    for(var fila=0;fila<this.cantFilas;fila++){
      this.pmatrix[fila]=[]
      for(var col=0;col<this.cantColumnas;col++){


        if (definidor.at(col)>fila){
          this.pmatrix[fila][col]='T';
        }else{
          this.pmatrix[fila][col]='F';
        }


      }
    }

    super(x,y,opcionesCuadricula,opcionesCasilla,this.pmatrix);
  }

  public cambiarImagenInicio(nuevaImagen){
    for (var nroColumna=0;nroColumna<this.pmatrix[0].length;nroColumna++){
      this.casilla(0,nroColumna).cambiarImagen(nuevaImagen);
    }
  }

  public cambiarImagenFin(nuevaImagen){
    for (var fila=0;fila<this.pmatrix.length;fila++){
      for (var col=0;col<this.pmatrix[0].length;col++){
        if(this.esLaUltima(fila,col)){
            this.casilla(fila,col).cambiarImagen(nuevaImagen);
        }
      }
    }
  }

  private esLaUltima(fila,col){
    return this.pmatrix[fila][col]=='T'&&(this.pmatrix[fila+1]==undefined||this.pmatrix[fila+1][col]=='F');
  }

  esFin(casilla){
    return this.esLaUltima(casilla.nroFila,casilla.nroColumna);
  }

  esInicio(casilla){
    return casilla.nroFila === 0;
  }

  largoColumna(indice){
    return this.pmatrix.filter(fila => fila[indice] === 'T').length;
  }
}




class CuadriculaMultiple extends CuadriculaEsparsa{
  pmatrix;

  constructor(definidor,x,y,opcionesCuadricula,opcionesCasilla){
    var max = definidor.dameMaximo();
    this.pmatrix=[];
    while(definidor.hayProxFila()){
      var fila=[];
      var cantColumnas=definidor.dameProxFila();
      var cant=0;
      while(cant<cantColumnas){
        fila.push('T');
        cant++;
      }
      while(cant<max){
        fila.push('F');
        cant++;
      }
      this.pmatrix.push(fila);
    }
    super(x,y,opcionesCuadricula,opcionesCasilla,this.pmatrix);
  }




  public cambiarImagenCasillas(imagenNueva){
    for (var nroFila = 0; nroFila < this.pmatrix.length; ++nroFila) {
      for (var nroColumna = 0; nroColumna < this.pmatrix[0].length; ++nroColumna){
        if(this.casilla(nroFila,nroColumna)){
          this.casilla(nroFila,nroColumna).cambiarImagen(imagenNueva);
        }
      }
    }

  }

  public cambiarImagenInicio(nuevaImagen){
    for (var nroFila = 0; nroFila < this.pmatrix.length; ++nroFila) {
      this.casilla(nroFila,0).cambiarImagen(nuevaImagen);

      }

    }

  public cambiarImagenFin(nuevaImagen){
    for (var nroFila = 0; nroFila < this.pmatrix.length; ++nroFila) {
      this.casilla(nroFila,this.dameIndexUltimaPosicion(nroFila)).cambiarImagen(nuevaImagen);
    }
  }

  // Este método era privado, pero se lo usa desde 'FutbolDeRobots'.
  // Cambiado a público.
  dameIndexUltimaPosicion(nroFila){
    var index=0;
    while(this.pmatrix[nroFila][index+1]=='T'){
    index+=1;}
    return index;
  }

  private cantidadColumnas(nroFila){
    return this.dameIndexUltimaPosicion(nroFila)+1;
  }

  esFin(casilla){
    return this.dameIndexUltimaPosicion(casilla.nroFila) === casilla.nroColumna;
  }

  esInicio(casilla){
    return casilla.nroColumna === 0;
  }

}


class ConjuntoClases {
     clases;

     constructor(clases){
         this.clases=clases;
     }

     dameUno(){
     	return new this.clases[Math.floor(Math.random() * this.clases.length)](0,0);
     }

}


class DefinidorColumnasDeUnaFila{
  /*TODO refactor de nombres para que quede mejor, dado
  que se está utilizando como definidor de filas o de columnas
  segun el caso*/
    index;
    tamanos;
    constructor(){
        this.index=0;
        this.tamanos=[];
    }

    size(){
      return this.tamanos.length;
    }

    at(index){
      return this.tamanos[index]
    }

    dameProxFila(){
        var a = this.tamanos[this.index];
        this.index += 1;
        return a;
    }

    hayProxFila(){
        return this.index < this.tamanos.length
    }

    nroFila(){
        //comienza a numerar desde cero
        return this.index;
    }

    dameMaximo(){
      var max=this.tamanos[0];
      for(var index=1;index<this.tamanos.length;index++){
        if(this.tamanos[index]>max){
          max=this.tamanos[index];
        }
      }
      return max;
    }
}

class DefinidorColumnasRandom extends DefinidorColumnasDeUnaFila{
    constructor(filas,cantidadMaxColumnas){
        super();
        this.tamanos=Array.apply(null, Array(filas)).map(function (_, i) {return Math.floor((Math.random() * cantidadMaxColumnas) + 3);});
    }
}

class DefinidorColumnasFijo extends DefinidorColumnasDeUnaFila{
    constructor(filas,tamanos){
        super();
        this.tamanos = tamanos;
    }
}
