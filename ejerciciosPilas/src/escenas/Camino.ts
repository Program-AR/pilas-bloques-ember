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
  puntos;
  constructor(x, y, direcciones,cantidadFilas,cantidadColumnas, opcionesCuadricula, opcionesCasilla){
    this.x=x;
    this.y=y;
    this.cantidadFilas=cantidadFilas;
    this.cantidadColumnas=cantidadColumnas;
    this.opcionesCuadricula=opcionesCuadricula;
    this.opcionesCasilla=opcionesCasilla;
    this.direcciones=direcciones;
    this.puntos = [];
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
      var cuadricula = new CuadriculaEsparsa(this.x,this.y,this.opcionesCuadricula,this.opcionesCasilla,this.matriz)
      this.cambiarImagenesCasillasCamino(cuadricula);
      return cuadricula;
  }

  cambiarImagenesCasillasCamino(cuadricula){
    this.puntos.slice(0,-1).forEach((punto, i) => {
      cuadricula.casilla(punto.y,punto.x).cambiarImagen(this.opcionesCasilla[this.direcciones[i]]);
    });
    let ultimoPunto = this.puntos.slice(-1)[0];
    cuadricula.casilla(ultimoPunto.y, ultimoPunto.x).cambiarImagen('finCamino.png', 1, 4);
    var llegada = cuadricula.casilla(ultimoPunto.y, ultimoPunto.x); // Porque el cambiarImagen rompe integridad referencial
    llegada.definirAnimacion('->', [0], 1);
    llegada.definirAnimacion('^', [3], 1);
    llegada.definirAnimacion('<-', [2], 1);
    llegada.definirAnimacion('v', [1], 1);
    llegada.cargarAnimacion(this.direcciones[cuadricula.cantidadCasillas() - 2]);
  }


  dameMatriz(){
    let aDevolver = [];

    for (var filas = 0; filas < this.cantidadFilas; ++filas) {
      let aux = [];
      for (var cols = 0; cols < this.cantidadColumnas; ++cols){
        aux.push('F');
      }
      aDevolver.push(aux);
    }
  
    let puntoActual = new Punto(0,0);
    this.puntos.push(puntoActual);
    aDevolver[puntoActual.y][puntoActual.x] = 'T';
  
    this.direcciones.forEach(direccion => {
      puntoActual = puntoActual.siguienteEn(direccion);
      this.puntos.push(puntoActual);
      aDevolver[puntoActual.y][puntoActual.x]='T';
    })
  
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

  private validarOpcionesCuadricula(opciones, maxAbj, maxDer)
  {
    if(opciones['largo_min'] != undefined &&
        opciones['largo_max'] != undefined)
    {
      var largo_min = opciones['largo_min'];
      var largo_max = opciones['largo_max'];
      
      if(largo_min < 1)
      {
        throw new ArgumentError("El largo debe ser al menos 1");
      }

      if(largo_min > maxAbj+maxDer+1)
      {
        throw new ArgumentError("El largo minimo supera al maximo posile");
      }
        
      if(largo_max < largo_min)
      {
        throw new ArgumentError("El largo debe maximo debe ser >= al minimo");
      }

      if(largo_max > maxAbj+maxDer+1)
      {
        throw new ArgumentError("El largo maximo supera al maximo posile");
      }  
    }
  }

  private calcularCantidadMovimientos(opciones, maxAbj, maxDer)
  {
    var largo_min = maxAbj + maxDer + 1;
    var largo_max = largo_min;
    if(opciones['largo_min'] != undefined &&
        opciones['largo_max'] != undefined)
    {
      largo_min = opciones['largo_min'];
      largo_max = opciones['largo_max'];
    }
    // Elegir al azar un largo entre el min y el max
    var largo = largo_min + Math.floor(Math.random() * (largo_max-largo_min + 1));
    // -1 Porque el largo esta en casillas y necesitamos cantidad de movimientos
    return largo - 1;
  }

  private dameDirecciones(filaInicio,colInicio,filaFin,colFin,opcionesCuadricula){
    //pre: solo me voy a moder para abajo y derecha. Con lo cual la
    //pos posInicialX<posFinalX posInicialY<posFinalY
    var cantMovDer=colFin-colInicio;
    var cantMovAbj=filaFin-filaInicio;

    this.validarOpcionesCuadricula(opcionesCuadricula, cantMovAbj, cantMovDer);
    var nMovimientos = this.calcularCantidadMovimientos(opcionesCuadricula, cantMovAbj, cantMovDer);
    
    var a=Array.apply(null, new Array(cantMovDer)).map(function(){return '->'})
    var b=Array.apply(null, new Array(cantMovAbj)).map(function(){return 'v'})
    var aDevolver = a.concat(b);
    
    return this.shuffleArray(aDevolver).slice(0, nMovimientos);
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
