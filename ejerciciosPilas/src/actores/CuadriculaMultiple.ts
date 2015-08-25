/*

1. La clase implementa una matriz donde cada fila tiene una cantidad distinta de columnas.

2. Cada fila es una cuadricula

3. Se permite inicializar con tamaños random o con tamaños fijos.

4. También, dado un definidor de Columnas (ver clase de este archivo), permite inicializar
esta matriz con objetos de esos tipos de manera aleatoria.

5. Se provee el método posicionar objeto que reemplaza al agregarActor tradicional

6. Para un ejemplo de utilizacion ver ElMonoQueSabeContar.ts

*/


/// <reference path = "../actores/cuadriculaEsparsa.ts"/>

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
      super(x,y,this.pmatrix.length,max,opcionesCuadricula,opcionesCasilla,this.pmatrix);
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

  private dameIndexUltimaPosicion(nroFila){
    var index=0;
    while(this.pmatrix[nroFila][index+1]=='T'){
    index+=1;}
    return index;
  }


      public completarConObjetosRandom(arrayClases){
        arrayClases = new conjuntoClases(arrayClases)
        for (var i =0; i < this.pmatrix.length ; i+=1){
        this.completarFilaConObjetosRandom(arrayClases,i);
        //this.filas.foreach(function(fila) {fila.completarConObjetosRandom(arrayClases)});
        }
      }

  private completarFilaConObjetosRandom(arrayClases,nroFila){
    for (var index = 1; index < this.cantidadColumnas(nroFila);index+=1){
        if (Math.random()<0.5) {
            this.agregarActor(arrayClases.dameUno(),nroFila,index)
        }
    }

  }

  private cantidadColumnas(nroFila){
    return this.dameIndexUltimaPosicion(nroFila)+1;
  }



      public avanzarFila(objeto){
          //TODO: deberia tener en cuenta que se puede ir del tablero????
          var filaActual=objeto.casillaActual().nroFila;
          if (objeto.casillaActual().nroColumna==0){
            if(objeto.cuadricula.cantFilas==filaActual+1){
              throw "No puedo ir para abajo"
            }
              objeto.hacer_luego(MoverACasillaAbajo,{})
          }else{
              throw "No estoy al inicio de la fila"
          }
      }

      public avanzarDesdeCualquierLado(objeto){
        objeto.cuadricula.agregarActor(objeto,objeto.casillaActual().nroFila+1,0)
      }

}


class conjuntoClases {
     clases;

     constructor(clases){
         this.clases=clases;
     }

     dameUno(){
     	return new this.clases[Math.floor(Math.random() * this.clases.length)](0,0);
     }

}

class Fila extends Cuadricula{
    cantidadColumnas;
    cuadriculaMultiple;
    nroFila;
    constructor(cuadriculaMultipleP,nroFilaP,cantidadColumnasP,altoCasilla){
        this.cantidadColumnas = cantidadColumnasP
        this.cuadriculaMultiple =cuadriculaMultipleP
        this.nroFila = nroFilaP
        super(-200+(this.cantidadColumnas/2)*altoCasilla, 200-(55*this.nroFila), 1, this.cantidadColumnas,
            {alto : altoCasilla, ancho : altoCasilla*this.cantidadColumnas, separacionEntreCasillas: 5},
            {grilla: 'casillaLightbot.png', cantColumnas:5,ancho: altoCasilla, alto:altoCasilla})
    }
    /*
    El ancho seteado de esa manera permite que todas las casillas tengan el mismo tamano
    El x tiene que ver con lograr acomodar todas las casillas sobre el margen izquierdo

    */
    //TODO: reemplazar el 200 por algun valor independiente del navegador

    public aplicarATodasCasillas(funcion){
      for (var index = 0; index < this.casillas.length; ++index) {
        funcion(this.casillas[index]);
      }

    }
    public siguienteFila(){

            if(this.existeSiguienteFila()){
                return this.cuadriculaMultiple.filas[this.nroFila+1];
            }else{
                throw "No hay siguiente fila"}

    }



    public existeSiguienteFila(){
        return this.nroFila<this.cuadriculaMultiple.filas.length-1
    }
    public completarConObjetosRandom(conjuntoClases){
    	// en la primer posicion no se debe guardar ningun objeto
        for (var index = 1; index < this.cantColumnas;index+=1){
            if (Math.random()<0.5) {
                this.agregarActor(conjuntoClases.dameUno(),0,index)
            }
        }
    }




}

class DefinidorColumnasDeUnaFila{
    index;
    tamanos;
    constructor(){
        this.index=0;
        this.tamanos=[];
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
        this.tamanos=Array.apply(null, Array(filas)).map(function (_, i) {return Math.floor((Math.random() * cantidadMaxColumnas) + 2);});
    }
}

class DefinidorColumnasFijo extends DefinidorColumnasDeUnaFila{
    constructor(filas,tamanos){
        super();
        this.tamanos = tamanos;
    }
}
