/// <reference path="../actores/ActorAnimado.ts"/>

class FutbolRobots  extends Base{
  automata : ActorAnimado;
  fondo;
  cuadricula;
  estado;
  definidor;

  iniciar() {
      this.estado=undefined;
      this.fondo = new Fondo('fondos.futbolRobots.png',0,0);
      var cantidadFilas=8;
      this.definidor = new DefinidorColumnasRandom(cantidadFilas,6)

      this.cuadricula = new CuadriculaMultiple(
        this.definidor,
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

      for (var fila=0;fila<cantidadFilas;++fila){


        this.cuadricula.agregarActor(new PelotaAnimada(0,0),fila,this.cuadricula.dameIndexUltimaPosicion(fila))

      }

   }
   atras() {
    this.automata.hacer_luego(MoverACasillaIzquierda);
  }

  avanzar(){
    this.automata.hacer_luego(MoverACasillaDerecha);
  }

  siguienteFila(){
    this.automata.hacer_luego(avanzarFilaEnCuadriculaMultiple);
  }

  patearPelota(){
    this.automata.hacer_luego(DesencadenarHabilidadSiColiciona,{"Habilidad":SerPateado,'etiqueta':'PelotaAnimada','mensajeError': 'No hay una pelota aquí','argumentosHabilidad':{'tiempoEnElAire':25,'aceleracion':0.0025,'elevacionMaxima':25,'gradosDeAumentoStep':-2}})
  }




}
