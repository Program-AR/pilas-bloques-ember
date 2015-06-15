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

  dameCamino(){
      var a = new  CuadriculaEsparsa(this.x,this.y,this.cantidadFilas,this.cantidadColumnas,this.opcionesCuadricula,{grilla:'casillaLightbot.png', cantColumnas: 5},this.matriz)
      this.cambiarImagenesCasillasCamino(this.direcciones,a,this.opcionesCasilla);
      return a;
  }

  private cambiarImagenesCasillasCamino(direcciones,cuadricula,opcionesCasilla){
    for(var index=0;index<cuadricula.casillas.length;index++){
      cuadricula.casillas[index].imagen=opcionesCasilla[this.direcciones[index]];
    }
  }


  dameMatriz(){
      var aDevolver=[];
      var puntoActual= new Punto(0,0);
      for(var filas=0;filas<this.cantidadFilas;++filas){
        var aux=[]
        for(var cols=0;cols<this.cantidadColumnas;++cols){
          aux.push('F')
        }
        aDevolver.push(aux);
      }

      aDevolver[puntoActual.y][puntoActual.x]='T';
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



  constructor(x,y,cantMaxX,cantMaxY,opcionesCuadricula, opcionesCasilla){
      var hastaX=this.dameCant(0,cantMaxX)+2;
      var hastaY=this.dameCant(0,cantMaxY)+2;
      //el +2 es para asegurar cuadricula minima
      super(x, y, this.dameDirecciones(0,0,hastaX,hastaY),hastaY,hastaX , opcionesCuadricula, opcionesCasilla);

  }

  private dameCant(desde,cantMax){
    return Math.floor(Math.random() * cantMax + desde)
  }


  private dameDirecciones(posInicialX,posInicialY,posFinalX,posFinalY){
    //pre: solo me voy a moder para abajo y derecha. Con lo cual la
    //pos posInicialX<posFinalX posInicialY<posFinalY
    var cantMovDer=posFinalX-posInicialX-1;
    var cantMovAbj=posFinalY-posInicialY-1;
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
