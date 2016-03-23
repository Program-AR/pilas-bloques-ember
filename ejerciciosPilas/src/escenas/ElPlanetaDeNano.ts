/// <reference path = "EscenaActividad.ts" />

class ElPlanetaDeNano extends EscenaActividad {
  automata;
  cantidadColumnas;
  cuadricula;
  fondo;
  secuenciaCaminata;
  tableroBananas;
  cantidadBananas;
iniciar() {
    //this.recolector.izquierda = pilas.izquierda();
    var cantidadFilas=4
    this.cantidadColumnas=5
    this.fondo = new Fondo('fondos.elPlanetaDeNano.png',0,0);

    this.cuadricula = new Cuadricula(0,0,cantidadFilas,this.cantidadColumnas,
        { alto: 300, ancho: 300, separacionEntreCasillas: 3},
        {grilla: 'casillas.elPlanetaDeNano.png'})

    this.automata = new NanoAnimado(0, 0);

    this.cuadricula.agregarActor(this.automata,cantidadFilas-1, 0);
    this.secuenciaCaminata = new Secuencia({'secuencia':[ new MoverACasillaIzquierda({})]})
    this.secuenciaCaminata.iniciar(this.automata);
    this.tableroBananas = new Tablero(150, 220, { texto: "Bananas" });
    this.cantidadBananas = new ObservadoConAumentar();
    this.cantidadBananas.cantidad = 0;
    this.cantidadBananas.registrarObservador(this.tableroBananas);
    this.completarConBananas();
}

  personajePrincipal(){
    return this.automata;
  }


  private completarConBananas(){
      this.cuadricula.agregarActor(new BananaAnimada(0,0),0,1);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),1,1);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),1,2);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),2,1);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),2,2);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),2,3);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),3,1);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),3,2);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),3,3);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),3,4);
  }

  estaResueltoElProblema() {
      return this.contarActoresConEtiqueta('BananaAnimada') == 0;
  }

}
