/// <reference path = "EscenaActividad.ts" />
/// <reference path="../actores/ActorAnimado.ts"/>
/// <reference path="../actores/CuadriculaMultiple.ts"/>
/// <reference path = "EstadosDeEscena.ts" />

class FutbolRobots  extends EscenaActividad{
  automata : ActorAnimado;
  fondo;
  cuadricula : CuadriculaMultiple;
  cantPateadas;
  cantidadFilas;

  iniciar() {
      this.fondo = new Fondo('fondos.futbolRobots.png',0,0);
      this.cantidadFilas=8;

      this.cuadricula = new CuadriculaMultiple(
        new DefinidorColumnasRandom(this.cantidadFilas,6),
        0,-50,
        {separacionEntreCasillas: 5},
        {grilla:'casilla.futbolRobots2.png', alto:40,ancho:40})
      this.cuadricula.cambiarImagenInicio('casilla.futbolRobots1.png');

      this.automata = new RobotAnimado(0, 0);
      this.cuadricula.agregarActor(this.automata,0,0);
      var casilla = this.cuadricula.casilla(0, 0);
      this.automata.escalarAAlto(3.5 * casilla.alto);
      this.automata.abajo = casilla.y - (0.25 * casilla.alto);
      this.automata.radio_de_colision = this.automata.alto / 2.5;

      for (var fila=0;fila<this.cantidadFilas;++fila){
        this.cuadricula.agregarActor(new PelotaAnimada(0,0),fila,this.cuadricula.dameIndexUltimaPosicion(fila))
      };

      this.estado = new EstadoParaContarBuilder(this, 'patear', this.cantidadFilas).estadoInicial();
   }
}
