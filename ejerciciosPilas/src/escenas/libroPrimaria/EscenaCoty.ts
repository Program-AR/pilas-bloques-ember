/// <reference path = "../DibujandoFiguras.ts" />
/// <reference path = "../../actores/libroPrimaria/Coty.ts" />
/// <reference path = "../../actores/libroPrimaria/Charco.ts" />

 class EscenaCoty extends DibujandoFiguras {
   _puntosEsperados: PuntoSimple[] | PuntoSimple[][];
   dibujoPreexistente: DibujoLineal;
   pizarraDibujoPreexistente: Pizarra;
   xCoty: number;
   yCoty: number;
   charco: Charco;
   puedeHaberCharco: boolean;

   constructor(xCoty: number, yCoty: number, dibujoPreexistente: PuntoSimple[] | PuntoSimple[][] = [], puntosEsperados: PuntoSimple[] | PuntoSimple[][] = [], puedeHaberCharco: boolean = false){
     super();
     this._puntosEsperados = puntosEsperados;
     this.dibujoPreexistente = DibujoLineal.desdePuntosSimples(dibujoPreexistente);
     this.xCoty = xCoty;
     this.yCoty = yCoty;
     this.puedeHaberCharco = puedeHaberCharco;
   }

   iniciar(){
     super.iniciar();
     if(this.puedeHaberCharco && Math.random()>=0.5){
       this.colocarCharco();
     }
   }

   hacerDibujoEsperado() {
     this.pizarraFantasma = new Pizarra();
     this.dibujoEsperado.dibujarEn(this.pizarraFantasma, pilas.colores.gris, this.anchoLinea, true);
   }

   hacerDibujoPreexistente(){
    this.pizarraDibujoPreexistente = new Pizarra();
    this.dibujoPreexistente.dibujarEn(this.pizarraDibujoPreexistente, pilas.colores.azuloscuro, this.anchoLinea);
   }

   colocarCharco(){
     this.charco = new Charco();
     this.charco.escala = this.automata.escala;

     // 50 pixeles es lo que salta el salto a la derecha
     const longSalto = 50;

     this.charco.setX(this.automata.getX() + (longSalto / 2));
     this.charco.setY(this.automata.getY());

     [this.pizarraDibujoPreexistente,this.pizarraFantasma].forEach(
       pizarra => pizarra.setX(pizarra.getX() + longSalto)
     );
   }

   crearAutomata(){
     this.automata = new Coty(this.xCoty,this.yCoty);
     this.automata.escala = 0.6;
   }

   puntosEsperados(){
     return this._puntosEsperados;
   }

   pathFondo(): string {
    return 'fondo.coty.png';
  }
}

class EscenaCotySonrisa extends EscenaCoty {
  constructor(){
    super(-25,10,[[{x:-25,y:10},{x:-25,y:60},{x:-75,y:60},{x:-75,y:10},{x:-25,y:10}]],
      [[{x:25,y:10},{x:25,y:60},{x:75,y:60},{x:75,y:10},{x:25,y:10}]]);
  }

  hacerDibujoPreexistente(){
    super.hacerDibujoPreexistente();
    this.pizarraDibujoPreexistente.circulo(0,0,150,pilas.colores.azuloscuro,this.anchoLinea);
    this.pizarraDibujoPreexistente.arco(0,0,100,Math.PI*0.25, Math.PI*0.75,pilas.colores.azuloscuro,this.anchoLinea);
  }
}