/// <reference path = "../DibujandoFiguras.ts" />
/// <reference path = "../../actores/libroPrimaria/Coty.ts" />
/// <reference path = "../../actores/libroPrimaria/Charco.ts" />
/// <reference path = "../../actores/FlechaEscenarioAleatorio.ts" />
/// <reference path = "../../habilidades/EstallarAlSalirDePantalla.ts"/>

type ArgumentosCoty = { xCoty?: number, yCoty?: number, longitudSegmento?: number, puedeHaberCharco?: boolean }

class EscenaCoty extends DibujandoFiguras {
  _puntosEsperados: PuntoSimple[] | PuntoSimple[][];
  dibujoPreexistente: DibujoLineal;
  pizarraDibujoPreexistente: Pizarra;
  xCoty: number;
  yCoty: number;
  charco: Charco;
  puedeHaberCharco: boolean;
  longitudSegmento: number;

  static clasesDeActoresInvolucrados(): typeof ActorAnimado[] {
    return [Coty, Charco, FlechaEscenarioAleatorio]
  }

  static pathFondo(): string {
    return 'fondo.coty.png';
  }

  constructor(dibujoPreexistente: PuntoSimple[] | PuntoSimple[][] = [], puntosEsperados: PuntoSimple[] | PuntoSimple[][] = [], argumentos: ArgumentosCoty) {
    super();
    this._puntosEsperados = puntosEsperados;
    this.dibujoPreexistente = DibujoLineal.desdePuntosSimples(dibujoPreexistente);
    this.sanitizarArgumentos(argumentos);
  }

  sanitizarArgumentos(argumentos: ArgumentosCoty) {
    this.xCoty = argumentos.xCoty || 0;
    this.yCoty = argumentos.yCoty || 0;
    this.longitudSegmento = argumentos.longitudSegmento || 50;
    this.puedeHaberCharco = Boolean(argumentos.puedeHaberCharco);
  }

  iniciar() {
    if (this.puedeHaberCharco) {
      new FlechaEscenarioAleatorio();
    }
    if (this.puedeHaberCharco && Math.random() >= 0.5) {
      this.crearCharco()
    }
    super.iniciar();
    if (this.charco) {
      this.ubicarCharco();
    }
    this.automata.aprender(EstallarAlSalirDePantalla, {});
  }

  hacerDibujoEsperado() {
    this.pizarraFantasma = new Pizarra();
    this.dibujoEsperado.dibujarEn(this.pizarraFantasma, this.colorDibujoEsperado(), this.anchoLinea, true);
  }

  hacerDibujoPreexistente() {
    this.pizarraDibujoPreexistente = new Pizarra();
    this.dibujoPreexistente.dibujarEn(this.pizarraDibujoPreexistente, createjs.Graphics.getRGB(41, 105, 165), this.anchoLinea);
  }

  crearCharco() {
    this.charco = new Charco();
  }

  ubicarCharco() {
    this.charco.escala = this.automata.escala * 0.85;

    this.charco.setX(this.automata.getX() + (this.longitudSegmento / 2));
    this.charco.setY(this.automata.getY() - this.automata.alto * 0.04);

    [this.pizarraDibujoPreexistente, this.pizarraFantasma].forEach(
      pizarra => pizarra.setX(pizarra.getX() + this.longitudSegmento)
    );
    this.dibujoEsperado = this.dibujoEsperado.trasladar(new PuntoDibujo(this.longitudSegmento, 0));
  }

  crearAutomata() {
    this.automata = new Coty(this.xCoty, this.yCoty);
    this.automata.escala = 0.6;
  }

  puntosEsperados() {
    return this._puntosEsperados;
  }

  colorDibujo() {
    return pilas.colores.rgb(35, 105, 166);
  }

  colorDibujoEsperado() {
    return pilas.colores.gris;
  }
}

class EscenaCotySonrisa extends EscenaCoty {
  constructor() {
    super([[{ x: -25, y: 10 }, { x: -25, y: 60 }, { x: -75, y: 60 }, { x: -75, y: 10 }, { x: -25, y: 10 }]],
      [[{ x: 25, y: 10 }, { x: 25, y: 60 }, { x: 75, y: 60 }, { x: 75, y: 10 }, { x: 25, y: 10 }]], { xCoty: -25, yCoty: 10 });
  }

  hacerDibujoPreexistente() {
    super.hacerDibujoPreexistente();
    this.pizarraDibujoPreexistente.circulo(0, 0, 150, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.arco(0, 0, 100, Math.PI * 0.25, Math.PI * 0.75, this.colorDibujo(), this.anchoLinea);
  }
}

class EscenaCotyCactus extends EscenaCoty {
  constructor() {
    super(
      [],
      [[{ x: -50, y: 50 }, { x: -50, y: 0 }, { x: -50, y: -50 }], [{ x: 50, y: -50 }, { x: 50, y: 0 }, { x: 50, y: 50 }]],
      { xCoty: 0, yCoty: 50 }
    )
  }

  hacerDibujoPreexistente() {
    super.hacerDibujoPreexistente();
    // Cabeza grande
    this.pizarraDibujoPreexistente.arco(0, 100, 50, Math.PI, 0, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.linea(-50, 50, -50, 100, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.linea(50, 50, 50, 100, this.colorDibujo(), this.anchoLinea);

    // Líneas cuerpo central
    this.pizarraDibujoPreexistente.linea(50, -50, 50, -100, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.linea(50, -150, 50, -200, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.linea(-50, -100, -50, -200, this.colorDibujo(), this.anchoLinea);

    // Bracito 1
    this.pizarraDibujoPreexistente.arco(-50, 0, 50, Math.PI * 1 / 2, Math.PI, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.arco(-50, 0, 100, Math.PI * 1 / 2, Math.PI, this.colorDibujo(), this.anchoLinea);

    // Cabeza chica 1
    this.pizarraDibujoPreexistente.arco(-125, 25, 25, Math.PI, 0, this.colorDibujo(), this.anchoLinea)
    this.pizarraDibujoPreexistente.linea(-150, 0, -150, 25, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.linea(-100, 0, -100, 25, this.colorDibujo(), this.anchoLinea);

    // Bracito 2
    this.pizarraDibujoPreexistente.arco(50, -50, 50, 0, Math.PI * 1 / 2, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.arco(50, -50, 100, 0, Math.PI * 1 / 2, this.colorDibujo(), this.anchoLinea);

    // Cabeza chica 2
    this.pizarraDibujoPreexistente.arco(125, -25, 25, Math.PI, 0, this.colorDibujo(), this.anchoLinea)
    this.pizarraDibujoPreexistente.linea(150, -50, 150, -25, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.linea(100, -50, 100, -25, this.colorDibujo(), this.anchoLinea);
  }
}

class EscenaCotyMate extends EscenaCoty {
  constructor() {
    super(
      [],
      [[{ x: -100, y: -50 }, { x: -100, y: -100 }], [{ x: -100, y: 0 }, { x: -50, y: 0 }, { x: 0, y: 0 }, { x: 50, y: 0 }], [{ x: 50, y: 100 }, { x: 50, y: 150 }, { x: 100, y: 150 }]],
      { xCoty: -100, yCoty: -100 }
    )
  }

  hacerDibujoPreexistente() {
    super.hacerDibujoPreexistente();
    this.pizarraDibujoPreexistente.arco(-100, -25, 25, Math.PI / 2, - Math.PI / 2, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.arco(50, -25, 25, - Math.PI / 2, Math.PI / 2, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.arco(-25, -100, 75, 0, Math.PI, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.linea(50, -50, 50, -100, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.linea(-10, 0, 50, 100, this.colorDibujo(), this.anchoLinea);
    this.pizarraDibujoPreexistente.linea(10, 0, 100, 150, this.colorDibujo(), this.anchoLinea);
  }
}
