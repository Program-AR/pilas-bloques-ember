/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/PapaNoelAnimado.ts" />

class SalvandoLaNavidad extends EscenaActividad {
  cantidadColumnas;

  iniciar() {
    this.fondo = new Fondo('fondo.salvandonavidad.png',0,0);
    this.cuadricula = new CuadriculaMultiple(
      new DefinidorColumnasFijo(5,[5,6,8,4,7]),
      0,0,
      {separacionEntreCasillas: 5},
      {grilla:'casilla.futbolRobots2.png', alto:40,ancho:40}
    );
    this.automata = new PapaNoelAnimado(0,0);
    this.cuadricula.agregarActorEnPerspectiva(this.automata,0,0);
  }
}
