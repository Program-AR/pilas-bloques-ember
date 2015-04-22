class SuperLightBot2 extends SuperLightBot1 {
 /*
    cantidadMaxColumnas = 9;   
    cuadricula;
    fondo;
    personaje;
    altoCasilla = 30;
    cantidadColumnas;
    */
    iniciar(){
        this.inicializarEscenaAleatoriamente();
        this.encenderAlgunasCasillasAleatoriamente();
    }

    private encenderAlgunasCasillasAleatoriamente(){
        //la primera y la ultima nunca se encienden
       for(var i = 1; i < this.cantidadColumnas-1; i++) {
            if (Math.random() < .6) {
            this.agregarLuz(i);
             }
          }
      }

     /*hay que permitirles AVANZAR Y ENCENDER LUZ*/
    
    
}
