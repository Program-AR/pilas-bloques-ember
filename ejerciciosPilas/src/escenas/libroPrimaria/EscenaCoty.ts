/// <reference path = "../DibujandoFiguras.ts" />
/// <reference path = "../../actores/libroPrimaria/Coty.ts" />
/// <reference path = "../../actores/libroPrimaria/Charco.ts" />
/// <reference path = "../../actores/ActorCompuesto.ts" />

 class EscenaCoty extends DibujandoFiguras {
   _dibujoEsperado: DibujoLineal;
   dibujoPreexistente: DibujoLineal;
   pizarraDibujoPreexistente: Pizarra;
   xCoty: number;
   yCoty: number;
   charco: Charco;
   puedeHaberCharco: boolean;

   constructor(xCoty: number, yCoty: number, dibujoPreexistente: DibujoLineal = [], dibujoEsperado: DibujoLineal = [], puedeHaberCharco: boolean = false){
     super();
     this._dibujoEsperado = dibujoEsperado;
     this.dibujoPreexistente = dibujoPreexistente;
     this.xCoty = xCoty;
     this.yCoty = yCoty;
     this.puedeHaberCharco = puedeHaberCharco;
   }

   iniciar(){
     super.iniciar();
     this.hacerDibujoPreexistente();
     if(this.puedeHaberCharco && Math.random()>=0.5){
       this.colocarCharco();
     }
   }

   hacerDibujoPreexistente(){
    this.pizarraDibujoPreexistente = new Pizarra();
    this.dibujar(this.pizarraDibujoPreexistente, this.dibujoPreexistente, pilas.colores.azuloscuro);
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

   dibujoEsperado(){
     return this._dibujoEsperado;
   }

   pathFondo(): string {
    return 'fondo.coty.png';
  }
}

class EscenaCotySonrisa extends EscenaCoty {
  constructor(){
    super(0,0,[[{x:0,y:0},{x:0,y:50},{x:-50,y:50},{x:-50,y:0},{x:0,y:0}]],
      [[{x:50,y:0},{x:50,y:5},{x:50,y:10},{x:50,y:15},{x:50,y:20},{x:50,y:25},{x:50,y:30},{x:50,y:35},{x:50,y:40},{x:50,y:45},{x:50,y:50},{x:55,y:50},{x:60,y:50},{x:65,y:50},{x:70,y:50},{x:75,y:50},{x:80,y:50},{x:85,y:50},{x:90,y:50},{x:95,y:50},{x:100,y:50},{x:100,y:45},{x:100,y:40},{x:100,y:35},{x:100,y:30},{x:100,y:25},{x:100,y:20},{x:100,y:15},{x:100,y:10},{x:100,y:5},{x:100,y:0},{x:95,y:0},{x:90,y:0},{x:85,y:0},{x:80,y:0},{x:75,y:0},{x:70,y:0},{x:65,y:0},{x:60,y:0},{x:55,y:0},{x:50,y:0}]]);
  }

  hacerDibujoPreexistente(){
    super.hacerDibujoPreexistente();
    this.pizarraDibujoPreexistente.circulo(0,0,150,pilas.colores.azuloscuro,6);
    this.pizarraDibujoPreexistente.arco(25,0,100,Math.PI*0.25, Math.PI*0.75,pilas.colores.azuloscuro,6);
  }
}