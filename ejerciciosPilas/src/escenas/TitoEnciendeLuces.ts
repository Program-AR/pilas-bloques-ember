/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/Tito.ts" />
/// <reference path = "../actores/Lamparin.ts" />
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>

class TitoEnciendeLuces extends EscenaActividad {
  fondo;
  automata;
  cuadricula;
  objetos = [];

  iniciar() {
    this.fondo = new Fondo('fondos.estrellas.png', 0, 0);

    this.cuadricula = new Cuadricula(0, 0, 5, 6,
      { separacionEntreCasillas: 5 },
      {
        grilla: 'casilla.grisoscuro.png',
        cantColumnas: 1, alto: 50, ancho: 50
      });


    //se cargan las luces
    var cant = 0;
    var fila = 3;
    var col = 0;
    while (cant < 4) {
      this.agregarLuz(fila, col);
      fila -= 1;
      col += 1;
      cant += 1;
    }
    cant = 0;
    fila = 4;
    col = 2;
    while (cant < 4) {
      this.agregarLuz(fila, col);
      fila -= 1;
      col += 1;
      cant += 1;
    };




    // se crea el automata
    this.automata = new Tito(0, 0);
    this.cuadricula.agregarActorEnPerspectiva(this.automata, 4, 0);
    this.automata.escalarAAncho(this.cuadricula.anchoCasilla() * 1.5);
  }

  agregarLuz(fila, columna) {
    var casillaLuminosa = new Lamparin(0, 0);
    this.cuadricula.agregarActor(casillaLuminosa, fila, columna);
    this.objetos.push(casillaLuminosa);
  }

  estaResueltoElProblema() {
    return this.objetos.every(o => o.nombreAnimacionActual() == 'prendida');
  }
}
