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
      var a = new  CuadriculaEsparsa(this.x,this.y,this.opcionesCuadricula,this.opcionesCasilla,this.matriz)
      this.cambiarImagenesCasillasCamino(this.direcciones,a,this.opcionesCasilla,this.opcionesCuadricula,this.cantidadFilas,this.cantidadColumnas);
      return a;
  }


  public cambiarImagenesCasillasCamino(direcciones,cuadricula,opcionesCasilla,opcionesCuadricula,cantFilas,cantColumnas){
    for(var index=0;index<cuadricula.casillas.length-1;index++){
      var aux=cuadricula.casillas[index].z;
      cuadricula.casillas[index].imagen=opcionesCasilla[this.direcciones[index]];
      cuadricula.casillas[index].z=aux;
    }
      var aux= cuadricula.casillas[cuadricula.casillas.length-1].z;
      cuadricula.casillas[cuadricula.casillas.length-1].imagen='finCamino.png'
      cuadricula.casillas[cuadricula.casillas.length-1].z=aux;
    //solo por reescalado
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
      super(x, y,this.dameDirecciones(1,1,cantFilas,cantColumnas) ,cantFilas,cantColumnas , opcionesCuadricula, opcionesCasilla);
  }

  private dameDirecciones(filaInicio,colInicio,filaFin,colFin){
    //pre: solo me voy a moder para abajo y derecha. Con lo cual la
    //pos posInicialX<posFinalX posInicialY<posFinalY
    var cantMovDer=colFin-colInicio;
    var cantMovAbj=filaFin-filaInicio;
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
