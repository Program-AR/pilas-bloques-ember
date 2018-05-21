/// <reference path = "../DibujandoFiguras.ts" />
/// <reference path = "../../actores/libroPrimaria/Coty.ts" />

 class EscenaCoty extends DibujandoFiguras {
   _dibujoEsperado: DibujoLineal;
   dibujoPreexistente: DibujoLineal;
   xCoty: number;
   yCoty: number;

   constructor(xCoty: number, yCoty: number, dibujoPreexistente: DibujoLineal = [], dibujoEsperado: DibujoLineal = []){
     super();
     this._dibujoEsperado = dibujoEsperado;
     this.dibujoPreexistente = dibujoPreexistente;
     this.xCoty = xCoty;
     this.yCoty = yCoty;
   }

   iniciar(){
     super.iniciar();
     // la pizarra sobre la que se hace el dibujo preexistente no se guarda porque no se usa para comparar
     this.dibujar(new Pizarra(), this.dibujoPreexistente, pilas.colores.azuloscuro);
   }

   crearAutomata(){
     this.automata = new Coty(this.xCoty,this.yCoty);
     this.automata.escala = 0.6;
   }

   dibujoEsperado(){
     return this._dibujoEsperado;
   }
}
