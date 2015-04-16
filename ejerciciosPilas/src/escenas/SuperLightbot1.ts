class SuperLightBot1 extends LightBotRecargado {
    cantidadMaxColumnas = 10;   
    cuadricula;
    fondo;
    personaje;
    altoCasilla = 30;
    cantidadColumnas;
    iniciar(){
        /*
        this.fondo = new Fondo('fondos/nubes.png',0,0);
        cantidadColumnas=
       this.cuadricula = new Cuadricula(0,0,1,cantidadColumnas,
            {alto: 100},
            {grilla: 'casillaLightbot.png', 
            cantColumnas: 5})
       this.robot = new Obrero(0, 0);
       this.robot.setCuadricula(this.cuadricula, 0, 0);*/
        this.fondo = new Fondo('fondos/fondoEstrellas.png',0,0);

        this.cantidadColumnas = Math.floor((Math.random() * this.cantidadMaxColumnas) + 2);
        this.cuadricula = new Cuadricula(-200+(this.cantidadColumnas/2)*this.altoCasilla,0,1,this.cantidadColumnas,
            {alto: this.altoCasilla , ancho:this.altoCasilla*this.cantidadColumnas},
            {grilla: 'casilla_base.png', cantColumnas: 1,alto:38})
        this.personaje = new Robot(0,0);
        this.personaje.setCuadricula(this.cuadricula,0,0)
        this.encenderAlgunasCasillas();


    }

    private encenderAlgunasCasillas(){
        //la primera y la ultima nunca se encienden
       for(var i = 1; i < this.cantidadColumnas-1; i++) {
            if (Math.random() < .7) {
            this.agregarLuz(i);
             }
          }
      }

     /*hay que permitirles AVANZAR Y ENCENDER LUZ*/
    
    
}














        
    
        