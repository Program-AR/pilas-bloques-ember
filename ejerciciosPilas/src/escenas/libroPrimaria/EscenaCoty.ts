/// <reference path = "../DibujandoFiguras.ts" />
/// <reference path = "../../actores/libroPrimaria/Coty.ts" />

 class EscenaCoty extends DibujandoFiguras {
   ptosSolucionParametrizados: number[][];
   ptosDibujoFijo: number[][];
   xCoty: number;
   yCoty: number;

   constructor(xCoty: number, yCoty: number, puntosDibujoFijo: number[][] = [], puntosSolucion: number[][] = []){
     super();
     this.ptosSolucionParametrizados = puntosSolucion;
     this.ptosDibujoFijo = puntosDibujoFijo;
     this.xCoty = xCoty;
     this.yCoty = yCoty;
   }

   iniciar(){
     super.iniciar();
     if(this.ptosDibujoFijo.length > 0 && !this.ptosDibujoFijo[0].length){
       // Convierto a lista de listas
       this.ptosDibujoFijo = [<any>this.ptosDibujoFijo];
     }
     // Como el dibujarFigura figura sólo con líneas continuas, recorro la lista de listas de puntos. Cada sublista es un dibujo continuo.
     this.ptosDibujoFijo.forEach(
       ptos => this.dibujarFigura(ptos[0],ptos, pilas.colores.azuloscuro)
     ); 
   }

   crearAutomata(){
     this.automata = new Coty(this.xCoty,this.yCoty);
     this.automata.escala = 0.6;
   }

   puntosSolucion(){
     return this.ptosSolucionParametrizados;
   }
}
