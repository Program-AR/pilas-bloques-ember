/// <reference path = "../DibujandoFiguras.ts" />
/// <reference path = "../../actores/libroPrimaria/Coty.ts" />

 class EscenaCoty extends DibujandoFiguras {
   ptosSolucionParametrizados;
   ptosDibujoFijo;
   xCoty;
   yCoty;

   constructor(xCoty, yCoty, puntosDibujoFijo = [], puntosSolucion = []){
     super();
     this.ptosSolucionParametrizados = puntosSolucion;
     this.ptosDibujoFijo = puntosDibujoFijo;
     this.xCoty = xCoty;
     this.yCoty = yCoty;
   }

   iniciar(){
     super.iniciar();
     this.dibujarFigura('dibujoFijo',this.ptosDibujoFijo[0],this.ptosDibujoFijo, pilas.colores.azuloscuro);
   }

   crearAutomata(){
     this.automata = new Coty(this.xCoty,this.yCoty);
     this.automata.escala = 3;
     //this.automata.x = -150;
     //this.automata.y = 100;
   }

   puntosSolucion(){
     return this.ptosSolucionParametrizados;
   }
}
