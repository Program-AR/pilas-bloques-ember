/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/CuadriculaMultiple.ts" />
/// <reference path = "../actores/PapaNoelAnimado.ts" />

class SalvandoLaNavidad extends EscenaActividad {
  cuadricula : CuadriculaMultiple;
  cantidadColumnas;

  iniciar() {
    this.fondo = new Fondo('fondo.salvandonavidad.png',0,0);
    this.cuadricula = new CuadriculaMultiple(
      new DefinidorColumnasFijo(5,[5,6,8,4,7]),
      0,0,
      {separacionEntreCasillas: 5},
      {grilla:'casilla.futbolRobots2.png', alto:40,ancho:40}
    );
    this.cuadricula.cambiarImagenInicio('casillainiciomono.png');
    this.automata = new PapaNoelAnimado(0,0);
    this.cuadricula.agregarActorEnPerspectiva(this.automata,0,0);
    this.automata.escala *= 1.8;
  }

  estaResueltoElProblema(){
    return this.hayRegalosAlFinalDeLasFilas()  && this.cuadricula.cantFilas === this.cantidadObjetosConEtiqueta("RegaloAnimado");
  }

  hayRegalosAlFinalDeLasFilas(){
    return this.ultimasCasillas().every( casilla => casilla.tieneActorConEtiqueta('RegaloAnimado') );
  }

  ultimasCasillas(){
    return this.cuadricula.filterCasillas(casilla => casilla.esFin());
  }


}
