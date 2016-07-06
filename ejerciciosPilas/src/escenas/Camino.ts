/// <reference path = "../actores/CuadriculaEsparsa.ts" />

/*Builder para una cuadricula esparsa con forma de camino*/

class Camino {
  x;
  y;
  cantidadFilas;
  cantidadColumnas;
  opcionesCuadricula;
  opcionesCasilla;
  matriz;
  direcciones;
  constructor(x, y, direcciones,cantidadFilas,cantidadColumnas, opcionesCuadricula, opcionesCasilla){
    this.x=x;
    this.y=y;
    this.cantidadFilas=cantidadFilas;
    this.cantidadColumnas=cantidadColumnas;
    this.opcionesCuadricula=opcionesCuadricula;
    this.opcionesCasilla=opcionesCasilla;
    this.direcciones=direcciones;
    this.matriz=this.dameMatriz();
  }

escalarCasillasCuadradas(){
    this.opcionesCasilla['ancho'] = this.opcionesCuadricula['ancho'] / this.cantidadColumnas;
    this.opcionesCasilla['alto'] = this.opcionesCuadricula['alto'] / this.cantidadFilas;
    if(this.opcionesCasilla['ancho']>this.opcionesCasilla['alto']){
      this.opcionesCasilla['ancho']=this.opcionesCasilla['alto']
    }else{
      this.opcionesCasilla['alto']=this.opcionesCasilla['ancho']
    }
    this.opcionesCasilla['grilla']='finCamino.png';
    this.opcionesCasilla['cantColumnas']= 1
    this.opcionesCuadricula['ancho']=this.opcionesCasilla['ancho']*(this.cantidadColumnas);
    this.opcionesCuadricula['alto']=this.opcionesCasilla['alto']*(this.cantidadFilas);
}

  dameCamino(){
      this.escalarCasillasCuadradas();
      var cuadricula = new  CuadriculaEsparsa(this.x,this.y,this.opcionesCuadricula,this.opcionesCasilla,this.matriz)
      this.cambiarImagenesCasillasCamino(cuadricula);
      return cuadricula;
  }

  cambiarImagenesCasillasCamino(cuadricula){
    for(var i = 0; i < cuadricula.casillas.length -1; i++){
      cuadricula.casillas[i].cambiarImagen(this.opcionesCasilla[this.direcciones[i]]);
    }
    cuadricula.casillas[cuadricula.casillas.length - 1].cambiarImagen('finCamino.png', 1, 4);
    var llegada = cuadricula.casillas[cuadricula.casillas.length - 1]; // Porque el cambiarImagen rompe integridad referencial
    llegada.definirAnimacion('->', [0], 1);
    llegada.definirAnimacion('^', [3], 1);
    llegada.definirAnimacion('<-', [2], 1);
    llegada.definirAnimacion('v', [1], 1);
    llegada.cargarAnimacion(this.direcciones[cuadricula.casillas.length - 2]);
  }


  dameMatriz(){
      var aDevolver=[];
      var puntoActual= new Punto(0,0);
      for(var filas=0;filas<this.cantidadFilas;++filas){
        var aux=[]
        for(var cols=0;cols<this.cantidadColumnas;++cols){
          aux.push('F');
        }
        console.log(aux);
        aDevolver.push(aux);
      }

      //var aDevolver = Array(this.cantidadFilas).fill(Array(this.cantidadColumnas).fill('F'));

      aDevolver[puntoActual.y][puntoActual.x]='T';
      console.log(this.direcciones)
      for(var index=0;index<this.direcciones.length;index++){
        puntoActual=puntoActual.siguienteEn(this.direcciones[index]);
        aDevolver[puntoActual.y][puntoActual.x]='T';
      }

      return aDevolver;
  }
}




class Punto{
  x:number;
  y:number;
  static mapa = {
    '->' : {x:1, y:0},
    '<-' : {x:-1, y:0},
    '^' : {x:0, y:-1},
    'v' : {x:0, y:1}
  };

  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  siguienteEn(dir){
    return new Punto(this.x + this.avanceX(dir), this.y + this.avanceY(dir));
  }

  avanceX(dir){
    return Punto.mapa[dir].x;
  }

  avanceY(dir){
    return Punto.mapa[dir].y;
  }

  cambiarOrigenDeCoordenadas(nuevoX, nuevoY){
    this.x = this.x - nuevoX;
    this.y = this.y - nuevoY;
  }

  invertirY(){
    this.y = 0 - this.y;
  }
}


class CuadriculaParaRaton extends Camino{



  constructor(x,y,cantFilas,cantColumnas,opcionesCuadricula, opcionesCasilla){
      super(x, y,this.dameDirecciones(1,1,cantFilas,cantColumnas,opcionesCuadricula) ,cantFilas,cantColumnas , opcionesCuadricula, opcionesCasilla);
  }

  private dameDirecciones(filaInicio,colInicio,filaFin,colFin,opcionesCuadricula){
    //pre: solo me voy a moder para abajo y derecha. Con lo cual la
    //pos posInicialX<posFinalX posInicialY<posFinalY
    var cantMovDer=colFin-colInicio;
    var cantMovAbj=filaFin-filaInicio;


    if(opcionesCuadricula['largo_min'] != undefined &&
        opcionesCuadricula['largo_max'] != undefined)
    {
      var largo_min = opcionesCuadricula['largo_min'];
      var largo_max = opcionesCuadricula['largo_max'];

      if(largo_min < 1)
      {
        console.log("El largo debe ser al menos 1");
        largo_min = 1;
      }

      if(largo_min > colFin-colInicio+filaFin-filaInicio+1)
      {
        console.log("El largo minimo supera al maximo posile");
        largo_min = colFin-colInicio+filaFin-filaInicio+1;
      }
        
      if(largo_max < largo_min)
      {
        console.log("El largo debe maximo debe ser >= al minimo");
        largo_max = largo_min;
      }

      if(largo_max > colFin-colInicio+filaFin-filaInicio+1)
      {
        console.log("El largo maximo supera al maximo posile");
        largo_max = colFin-colInicio+filaFin-filaInicio+1;
      }
        
      // Elegir al azar un largo entre el min y el max
      var largo = largo_min + Math.floor(Math.random() * (largo_max-largo_min + 1));
      // -1 Porque el largo esta en casillas y necesitamos cantidad de movimientos
      var nMovimientos = largo - 1;
      cantMovDer=0;
      cantMovAbj=0;
      // Elegir nMovimientos movimientos al azar, si exceder las dimensiones de la cuadricula
      for(var i=0;i<nMovimientos;i++)
      {
        if(cantMovDer == colFin-colInicio)
          cantMovAbj++;
        else if(cantMovAbj == filaFin-filaInicio)
          cantMovDer++;
        else if(Math.random() < 0.5)
          cantMovAbj++;
        else
          cantMovDer++;
      }
    }

    var a=Array.apply(null, new Array(cantMovDer)).map(function(){return '->'})
    var b=Array.apply(null, new Array(cantMovAbj)).map(function(){return 'v'})
    var aDevolver = a.concat(b);
    return this.shuffleArray(aDevolver);
  }

    private shuffleArray(array) {

        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }


}
