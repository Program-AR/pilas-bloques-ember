/// <reference path = "../DibujandoFiguras.ts" />
/// <reference path = "../../actores/libroPrimaria/Coty.ts" />

 class EscenaCoty extends DibujandoFiguras {
   ptosSolucionParametrizados;
   
   constructor(puntosSolucion = []){
     super();
     this.ptosSolucionParametrizados = puntosSolucion;
   }

   crearAutomata(){
     this.automata = new Coty();
     this.automata.escala = 3;
     //this.automata.x = -150;
     //this.automata.y = 100;
   }

   puntosSolucion(){
     return this.ptosSolucionParametrizados;
   }
}
