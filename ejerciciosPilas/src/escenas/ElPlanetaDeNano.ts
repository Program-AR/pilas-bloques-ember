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
    this.cantidadFilas=6
    this.cantidadColumnas=8
    this.fondo = new Fondo('fondos.elPlanetaDeNano.png',0,0);

    this.cuadricula = new Cuadricula(0,-30,this.cantidadFilas,this.cantidadColumnas,
        { alto: 350, ancho: 350, separacionEntreCasillas: 3},
        {grilla: 'casillas.elPlanetaDeNano.png'})

    this.automata = new NanoAnimado(0, 0);

    this.cuadricula.agregarActor(this.automata,this.cantidadFilas-1, 0);
    this.automata.escala *= 1.6
    this.automata.y += 1;

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
      var cantidad = [5, 2, 3, 7, 2, 4];
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
