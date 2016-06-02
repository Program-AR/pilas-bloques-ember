/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Dibujante.ts" />

class DibujandoFiguras extends EscenaActividad {
    pizarraFantasma;
    iniciar() {
        this.fondo = new Fondo('fondo.dibujando.figuras.png',0,0);
        this.automata = new Dibujante();
        this.automata.escala = 0.5;
        this.automata.x = -150;
        this.automata.y = 100;
        this.dibujarFiguraFantasma();
    }

    dibujarFiguraFantasma(){
      this.pizarraFantasma = new pilas.actores.Pizarra();

      var origen = {x: this.automata.x, y: this.automata.y};
      this.puntosSolucion().forEach( destino => {
        this.pizarraFantasma.linea(origen.x, origen.y, destino.x, destino.y, pilas.colores.grisclaro, 6);
        origen = destino;
      });
    }

    estaResueltoElProblema(){
      return (<any>this.automata).pizarra.tieneIgualDibujoQue(this.pizarraFantasma);
    }

    puntosSolucion(){
      // abstracto, sobreescribir.
      // Es un array de puntos que se obtiene haciendo
      // automata.pizarra.puntosSinRepetir()
      return [];
    }
}

class DibujandoFigurasInicial extends DibujandoFiguras {
  puntosSolucion(){
    return [{x:-140,y:100}, {x:-130,y:100}, {x:-120,y:100}, {x:-110,y:100}, {x:-100,y:100}, {x:-90,y:100}, {x:-80,y:100}, {x:-70,y:100}, {x:-60,y:100}, {x:-50,y:100}, {x:-50,y:90}, {x:-50,y:80}, {x:-50,y:70}, {x:-50,y:60}, {x:-50,y:50}, {x:-50,y:40}, {x:-50,y:30}, {x:-50,y:20}, {x:-50,y:10}, {x:-50,y:0}, {x:-60,y:0}, {x:-70,y:0}, {x:-80,y:0}, {x:-90,y:0}, {x:-100,y:0}, {x:-110,y:0}, {x:-120,y:0}, {x:-130,y:0}, {x:-140,y:0}, {x:-150,y:0}, {x:-150,y:10}, {x:-150,y:20}, {x:-150,y:30}, {x:-150,y:40}, {x:-150,y:50}, {x:-150,y:60}, {x:-150,y:70}, {x:-150,y:80}, {x:-150,y:90}, {x:-150,y:100}];
  }
}
