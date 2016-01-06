class SuperLightBot1 extends LightBotRecargado {
    cantidadMaxColumnas = 9;   
    cuadricula;
    fondo;
    personaje;
    altoCasilla = 30;
    cantidadColumnas;
    iniciar(){
      this.inicializarEscenaAleatoriamente();
      this.encenderTodasLasCasillas();
    }

    public inicializarEscenaAleatoriamente(){
      this.fondo = new Fondo('fondos.estrellas.png', 0, 0);

      this.cantidadColumnas = Math.floor((Math.random() * this.cantidadMaxColumnas) +3);
      this.cuadricula = new Cuadricula(-200 + (this.cantidadColumnas / 2) * this.altoCasilla, 0, 1, this.cantidadColumnas,
          { alto: this.altoCasilla, ancho: this.altoCasilla * this.cantidadColumnas },
          { grilla: 'casilla_base.png', cantColumnas: 1, alto: 38 })
      this.personaje = new Tito(0, 0);
      this.cuadricula.agregarActor(this.personaje, 0, 0)
    }

    private encenderTodasLasCasillas(){
        //la primera y la ultima nunca se encienden
      for(var i = 1; i < this.cantidadColumnas-1; i++) {
        this.agregarLuz(i);
      }
    }



    
}














        
    
        