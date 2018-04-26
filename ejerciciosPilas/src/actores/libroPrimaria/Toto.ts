/// <reference path="../ActorAnimado.ts"/>

class Toto extends ActorAnimado {
  cuadriculaLectura : Cuadricula;

  constructor() {
    super(0, 0, {grilla: 'actor.toto.png', cantFilas: 1, cantColumnas: 1});
  }

  caracterActual(){
    let letra = this.casillaActual().actoresConEtiqueta('Letra')[0];
    if(!letra) throw new ActividadError("No hay una letra aquí");
    return letra.caracter();
  }
}
