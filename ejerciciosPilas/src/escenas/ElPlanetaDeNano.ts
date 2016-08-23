/// <reference path = "EscenaActividad.ts" />

class ElPlanetaDeNano extends EscenaActividad {
  automata;
  cantidadFilas;
  cantidadColumnas;
  cuadricula;
  fondo;
  secuenciaCaminata;
  cantidadInicial: any;
  tablero;

iniciar() {
    //this.recolector.izquierda = pilas.izquierda();
    this.cantidadFilas=4
    this.cantidadColumnas=5
    this.fondo = new Fondo('fondos.elPlanetaDeNano.png',0,0);

    this.cuadricula = new Cuadricula(0,0,this.cantidadFilas,this.cantidadColumnas,
        { alto: 300, ancho: 300, separacionEntreCasillas: 3},
        {grilla: 'casillas.elPlanetaDeNano.png'})

    this.automata = new NanoAnimado(0, 0);

    this.cuadricula.agregarActor(this.automata,this.cantidadFilas-1, 0);
    this.automata.escala *= 1.8;
    this.automata.y += 15;

    this.secuenciaCaminata = new Secuencia({'secuencia':[ new MoverACasillaIzquierda({})]})
    this.secuenciaCaminata.iniciar(this.automata);

    this.completarConBananas();
    this.cantidadInicial = this.contarActoresConEtiqueta('BananaAnimada');

    this.tablero = new Tablero(150, 220, {texto: "Bananas"});
  }

  actualizar() {
    super.actualizar();
    this.tablero.setearValor(this.cantidadRecolectadas());
  }

  private cantidadRecolectadas() {
    var cantidadActual: any = this.contarActoresConEtiqueta('BananaAnimada');
    return this.cantidadInicial - cantidadActual;
  }

  private completarConBananas(){
      var cantidad = [2, 4, 1, 3];
      for(var i=0; i < this.cantidadFilas; i++)
      {
        for(var j=1; j<= cantidad[i]; j++)
        {
          this.cuadricula.agregarActor(new BananaAnimada(0,0),i,j);
        }
      }
  }

  estaResueltoElProblema() {
      return this.contarActoresConEtiqueta('BananaAnimada') == 0;
  }

}
