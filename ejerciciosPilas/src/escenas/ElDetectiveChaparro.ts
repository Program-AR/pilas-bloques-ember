/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Detective.ts" />
/// <reference path = "../actores/Sospechoso.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../habilidades/Flotar.ts" />
/// <reference path = "../comportamientos/Decir.ts" />


 class ElDetectiveChaparro extends EscenaActividad {
   culpable: Sospechoso;
   cuadricula: Cuadricula;

  iniciar() {
    this.fondo = new Fondo('fondo.detective.png',0,0);
    this.cuadricula = new Cuadricula(0, -30, 1, 7,
      { ancho: 400, alto: 400 },
      { grilla: 'invisible.png', cantColumnas: 1 });

    Sospechoso.reiniciarDisfraces();
    var nroCulpable = Math.floor(Math.random() * 7);
    [0, 1, 2, 3, 4, 5, 6].forEach(pos => {
      var sospechoso = new Sospechoso();
      this.cuadricula.agregarActor(sospechoso, 0, pos, false);
      if (pos === nroCulpable) this.culpable = sospechoso;
    });

    this.culpable.hacerCulpable();

    this.automata = new Detective();
    this.cuadricula.agregarActor(this.automata, 0, Math.floor(Math.random() * 7), false);
    this.automata.y = -100;
    this.automata.aprender(Flotar,{});
  }

  estaResueltoElProblema() {
    return this.automata.casillaActual() === this.culpable.casillaActual() &&
      this.culpable.teEncontraron();
  }

}

class SacarDisfraz extends Decir {
  iniciar(receptorDetective) {
    this.argumentos.receptor = receptorDetective.obtenerActorBajoLaLupa();
    this.argumentos.receptor.sacarDisfraz();
    this.argumentos.mensaje = this.argumentos.receptor.mensajeAlSacarDisfraz();
    super.iniciar(receptorDetective);
  }
}
