/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Dibujante.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts" />

/**
 * Aquí se proveen algunas abstracciones que sirven para dibujar en una Pizarra.
 * Es lo necesario para poder trabajar con dibujos (lineales) construidos a partir de una
 * lista de puntos, ó lista de listas de puntos (para cuando el dibujo no es conexo).
 * La semántica de una lista de puntos es la serie de puntos que se conectan, en orden.
 * Cada segmento del dibujo empieza en un punto, y sigue al otro.
 * 
 * Para dibujar una "L" se puede usar esta lista: 
 *    [{x:0,y:10},{x:0,y:0},{x:5,y:0}]
 * Para dibujar dos rayas "- -" se puede usar esta lista de listas:
 *    [[{x:-5,y:0},{x:0,y:0}],[{x:5,y:0},{x:10,y:0}]]
 */

/**
 * El tipo de un punto (tiene x e y, es una coordenada)
 */
type PuntoDibujo = {x:number, y:number};

type PuntosDibujo = PuntoDibujo[] | PuntoDibujo[][];

/**
 * Es la clase que debe conocer el que utiliza los dibujos.
 * Sirve tanto para aunar los tipos de dibujos (conexos ó no conexos) como para crear y
 * dibujar de forma homogénea y sin importar si es lista ó lista de listas.
 */
abstract class DibujoLineal {
  /**
   * El método a llamar para crear una pizarra.
   * @param pizarra La pizarra en la que se dibujará
   */
  abstract dibujarEn(pizarra:Pizarra, color?, grosor?);

  /**
   * El método principal para crear un dibujo a partir de puntos.
   * @param puntos Lista ó lista de lista de puntos
   */
  static nuevo(puntos:PuntosDibujo): DibujoLineal{
    //Si vino un dibujo conexo, creo un conexo:
    if(puntos.length === 0 || !(<any>puntos)[0].length){
      return new DibujoConexo(<PuntoDibujo[]>puntos);
    } else {
      return new DibujoCompuesto(<PuntoDibujo[][]>puntos);
    }
  }
}

class DibujoConexo extends DibujoLineal {
  _puntos: PuntoDibujo[];

  constructor(puntos:PuntoDibujo[]){
    super();
    this._puntos = puntos;
  }

  dibujarEn(pizarra: Pizarra, color?, grosor?){
    var origen = this._puntos[0];
    this._puntos.forEach( destino => {
      pizarra.linea(origen.x, origen.y, destino.x, destino.y, color, grosor);
        origen = destino;
    });
  }
}

class DibujoCompuesto extends DibujoLineal {
    _subdibujos: DibujoLineal[];

    constructor(dibujos: PuntoDibujo[][]){
      super();
      this._subdibujos = dibujos.map( ptos => DibujoLineal.nuevo(ptos) );
    }

    dibujarEn(pizarra: Pizarra, color?, grosor?){
      this._subdibujos.forEach( dibujo => dibujo.dibujarEn(pizarra, color, grosor) );
    }
}