/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "../Direct.ts" />

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

type PuntoSimple = { x: number, y: number };
type SegmentoSimple = { inicio: PuntoSimple, fin: PuntoSimple };

/**
 * El tipo de un punto (tiene x e y, es una coordenada)
 */
class PuntoDibujo {
  static epsilon = Math.pow(2, -52);
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static desdePunto(punto: PuntoDibujo) {
    return new PuntoDibujo(punto.x, punto.y);
  }

  igualA(otroPunto: PuntoDibujo): boolean {
    return Math.abs(this.x - otroPunto.x) < PuntoDibujo.epsilon && Math.abs(this.y - otroPunto.y) < PuntoDibujo.epsilon;
  }

  norma(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  static suma(p1: PuntoDibujo, p2: PuntoDibujo): PuntoDibujo {
    return new PuntoDibujo(p1.x + p2.x, p1.y + p2.y);
  }

  sumar(otroPunto: PuntoDibujo): PuntoDibujo {
    return PuntoDibujo.suma(this, otroPunto);
  }

  static comparar(p1: PuntoDibujo, p2: PuntoDibujo): number {
    if (p1.x == p2.x) return p1.y - p2.y;
    else return p1.x - p2.x;
  }

  static desdePuntoSimple(p: PuntoSimple): PuntoDibujo {
    return new PuntoDibujo(p.x, p.y);
  }
}


class SegmentoDibujo {
  inicio: PuntoDibujo;
  fin: PuntoDibujo;

  constructor(inicio: PuntoDibujo, fin: PuntoDibujo) {
    this.inicio = inicio;
    this.fin = fin;
  }

  direccion(): Direct {
    return new Direct(this.inicio, this.fin);
  }

  longitud(): number {
    return new PuntoDibujo(this.fin.x - this.inicio.x, this.fin.y - this.inicio.y).norma();
  }

  igualA(otroSegmento: SegmentoDibujo): boolean {
    return this.inicio.igualA(otroSegmento.inicio) &&
      this.fin.igualA(otroSegmento.fin);
  }

  contieneA(unPunto: PuntoDibujo): boolean {
    var aux: SegmentoDibujo = new SegmentoDibujo(this.inicio, unPunto);
    return this.mismaDireccionYSentidoQue(aux) && aux.longitud() <= this.longitud();
  }

  paraleloA(otroSegmento: SegmentoDibujo): boolean {
    return this.direccion().isParallelTo(otroSegmento.direccion());
  }

  mismaDireccionYSentidoQue(otroSegmento: SegmentoDibujo): boolean {
    return this.direccion().equals(otroSegmento.direccion());
  }

  adyacenteA(otroSegmento: SegmentoDibujo): boolean {
    return this.fin.igualA(otroSegmento.inicio);
  }

  contiguoA(otroSegmento: SegmentoDibujo): boolean {
    return this.mismaDireccionYSentidoQue(otroSegmento) && this.adyacenteA(otroSegmento);
  }

  unificarConContiguo(otroSegmento: SegmentoDibujo): SegmentoDibujo {
    return new SegmentoDibujo(this.inicio, otroSegmento.fin)
  }

  static unificarContiguos(segmentos: SegmentoDibujo[]): SegmentoDibujo[] {
    var segmentosUnificados: SegmentoDibujo[] = segmentos.slice(0,1);
    segmentos.slice(1).forEach((s2: SegmentoDibujo) => {
      var s1: SegmentoDibujo = segmentosUnificados.pop();
      if (s1.contiguoA(s2)) {
        segmentosUnificados.push(s1.unificarConContiguo(s2));
      }
      else {
        segmentosUnificados.push(s1, s2);
      }
    });
    return segmentosUnificados;
  }

  unificableCon(otroSegmento: SegmentoDibujo): boolean {
    return this.paraleloA(otroSegmento) && (this.contieneA(otroSegmento.inicio) || this.contieneA(otroSegmento.fin) || otroSegmento.contieneA(this.inicio));
  }

  unificarCon(otroSegmento: SegmentoDibujo): SegmentoDibujo {
    var puntos = [this.inicio, this.fin, otroSegmento.inicio, otroSegmento.fin];
    puntos.sort(PuntoDibujo.comparar);
    return new SegmentoDibujo(puntos[0], puntos[3]);
  }

  unificarConMuchos(segmentos: SegmentoDibujo[]): SegmentoDibujo {
    let s1: SegmentoDibujo = this;
    for (let j = 0; j < segmentos.length; j++) {
      let s2 = segmentos[j];
      if (s1.unificableCon(s2)) {
        s1 = this.unificarCon(s2);
        segmentos.splice(j, 1);
        j--;
      }
    }
    return s1;
  }

  trasladar(vector: PuntoDibujo): SegmentoDibujo {
    return new SegmentoDibujo(this.inicio.sumar(vector), this.fin.sumar(vector));
  }

  static unificarMuchos(segmentos: SegmentoDibujo[]): SegmentoDibujo[] {
    var segmentosUnificados: SegmentoDibujo[] = [];
    segmentos.forEach(segmento =>
      segmentosUnificados.push(segmento.unificarConMuchos(segmentosUnificados))
    )
    return segmentosUnificados;
  }

  

  static desdePuntos(puntos: PuntoDibujo[]): SegmentoDibujo[] {
    var segmentos: SegmentoDibujo[] = [];
    var inicio: PuntoDibujo = puntos[0];
    puntos.slice(1).forEach(fin => {
      segmentos.push(new SegmentoDibujo(inicio, fin));
      inicio = fin;
    });
    return segmentos;
  }
  
  static comparar(s1: SegmentoDibujo, s2: SegmentoDibujo): number {
    if (PuntoDibujo.comparar(s1.inicio, s2.inicio) == 0) return PuntoDibujo.comparar(s1.fin, s2.fin);
    else return PuntoDibujo.comparar(s1.inicio, s2.inicio);
  }

  ordenarExtremos(): SegmentoDibujo {
    if (PuntoDibujo.comparar(this.inicio, this.fin) > 0) {
      return new SegmentoDibujo(this.fin, this.inicio);
    }
    else {
      return new SegmentoDibujo(this.inicio, this.fin);
    }
  }

  static desdeSegmentoSimple(s: SegmentoSimple): SegmentoDibujo {
    return new SegmentoDibujo(PuntoDibujo.desdePuntoSimple(s.inicio), PuntoDibujo.desdePuntoSimple(s.fin));
  }
}

class DibujoLineal {
  _segmentos: SegmentoDibujo[];

  /**
   * Para crear un dibujo a partir de segmentos.
   * @param segmentos Lista de segmentos.
   * @param unificar Determina si se unificarán previamente
   * todos los segmentos que sea posible, es decir, que tengan la misma
   * dirección y que compartan como mínimo un punto. Falso por defecto.
   */
  constructor(segmentos: SegmentoDibujo[], unificar: boolean = false) {
    if (unificar) {
    segmentos = SegmentoDibujo.unificarContiguos(segmentos);
    segmentos = SegmentoDibujo.unificarMuchos(segmentos);
    }
    this._segmentos = segmentos;
  }

  static desdeSegmentosSimples(segmentosSimples: SegmentoSimple[], unificar?: boolean): DibujoLineal {
    var segmentos: SegmentoDibujo[] = segmentosSimples.map((s: SegmentoSimple) =>
      SegmentoDibujo.desdeSegmentoSimple(s)
    );
    return new DibujoLineal(segmentos, unificar);
  }

  /**
   * Para crear un dibujo a partir de puntos.
   * @param puntos Lista o lista de lista de puntos.
   */
  static desdePuntos(puntos: PuntoDibujo[] | PuntoDibujo[][], unificar?: boolean): DibujoLineal {
    // Si vino un dibujo conexo, creo un conexo:
    var segmentos: SegmentoDibujo[];
    if (puntos.length > 0 && Array.isArray(puntos[0])) {
      var aux: SegmentoDibujo[][] = (puntos as PuntoDibujo[][]).map(p => SegmentoDibujo.desdePuntos(p));
      segmentos = aux.reduce((acum, actual) => acum.concat(actual));
    }
    else {
      segmentos = SegmentoDibujo.desdePuntos(puntos as PuntoDibujo[]);
    }
    return new DibujoLineal(segmentos, unificar);
  }

  static desdePuntosSimples(puntosSimples: PuntoSimple[] | PuntoSimple[][], unificar?: boolean): DibujoLineal {
    var puntos: PuntoDibujo[] | PuntoDibujo[][];
    if (puntosSimples.length > 0 && Array.isArray(puntosSimples[0])) {
      puntos = (puntosSimples as PuntoSimple[][]).map(array =>
        array.map(puntoSimple =>
          new PuntoDibujo(puntoSimple.x, puntoSimple.y)
        )
      );
    }
    else {
      puntos = (puntosSimples as PuntoSimple[]).map(puntoSimple =>
        new PuntoDibujo(puntoSimple.x, puntoSimple.y)
      );
    }
    return DibujoLineal.desdePuntos(puntos, unificar);
  }

  /**
   * Para crear un dibujo a partir de lo que aparece representado en una pizarra.
   */
  static desdePizarra(pizarra: Pizarra, unificar?: boolean) {
    var segmentos: SegmentoSimple[] = pizarra.segmentosDeDibujoLineal()
    return DibujoLineal.desdeSegmentosSimples(segmentos, unificar);
  }

  /**
   * El método a llamar para crear una pizarra.
   * @param pizarra La pizarra en la que se dibujará
   */
  dibujarEn(pizarra: Pizarra, color?, grosor?, dibujarPuntos: boolean = false) {
    this.segmentos().forEach(segmento => {
      if (dibujarPuntos)
        pizarra.dibujar_punto(segmento.inicio.x, segmento.inicio.y, color, grosor);
      pizarra.linea(segmento.inicio.x, segmento.inicio.y, segmento.fin.x, segmento.fin.y, color, grosor);
      if (dibujarPuntos)
        pizarra.dibujar_punto(segmento.fin.x, segmento.fin.y, color, grosor);
    });
  }

  /**
   * Traslada el dibujo en la dirección indicada
   */
  trasladar(vector: PuntoDibujo): DibujoLineal {
    return new DibujoLineal(this._segmentos.map(segmento => segmento.trasladar(vector)));
  }

  /**
   * Retorna los segmentos que conforman el dibujo.
   */
  segmentos(): SegmentoDibujo[] {
    return this._segmentos;
  }

  segmentosOrdenados(): SegmentoDibujo[] {
    return this._segmentos.map(segmento => segmento.ordenarExtremos()).sort(SegmentoDibujo.comparar);
  }

  igualA(otroDibujo: DibujoLineal) {
    var misSegmentos = this.segmentosOrdenados();
    var otrosSegmentos = otroDibujo.segmentosOrdenados();
    return misSegmentos.length == otrosSegmentos.length &&
      misSegmentos.every((s, index) => s.igualA(otrosSegmentos[index]));
  }

  // /**
  //  * Retorna los puntos que conforman el dibujo.
  //  */
  // puntos(): PuntoDibujo[] | PuntoDibujo[][] {

  // }

  // /**
  //  * Da los puntos en string. Es útil para crear desafíos.
  //  */
  // stringPuntos(): string;
}
