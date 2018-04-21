/// <reference path="../ActorAnimado.ts"/>

class Toto extends ActorAnimado {
  cuadriculaLectura : Cuadricula;;

  constructor() {
    super(0, 0, {grilla: 'actor.toto.png', cantFilas: 1, cantColumnas: 1});
  }
}
