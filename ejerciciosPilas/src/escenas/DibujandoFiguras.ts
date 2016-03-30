/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Dibujante.ts" />

class DibujandoFiguras extends EscenaActividad {
    iniciar() {
        this.fondo = new Fondo('fondo.dibujando.figuras.png',0,0);
        this.automata = new Dibujante();
        this.automata.escala = 0.5;
        this.automata.x = -150;
        this.automata.y = 150;
    }
}
