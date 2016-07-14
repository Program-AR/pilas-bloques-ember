/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/ScoutAnimado.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/CompuAnimada.ts" />

class PrendiendoLasFogatas extends EscenaActividad {
    cuadricula;
    cantidadMaxColumnas;
    cantidadMaxFilas;
    cantidadMinColumnas;
    cantidadMinFilas;
    cantidadFilas;
    cantidadColumnas;
    ladoCasilla;
    compus;

    iniciar() {
        this.compus = [];
        this.cantidadMaxColumnas=12;
        this.cantidadMinColumnas=4;
        this.cantidadMaxFilas=10;
        this.cantidadMinFilas=5;
        this.ladoCasilla = 30;
        this.fondo = new Fondo('fondo.BosqueDeNoche.png', 0, 0);

        this.cantidadFilas = Math.floor(this.cantidadMinFilas + (Math.random() * (this.cantidadMaxFilas - this.cantidadMinFilas)));
        this.cantidadColumnas = Math.floor(this.cantidadMinColumnas + (Math.random() * (this.cantidadMaxColumnas - this.cantidadMinColumnas)));
        this.cuadricula = new Cuadricula(0, 0, this.cantidadFilas, this.cantidadColumnas,
            { separacionEntreCasillas: 2 },
            { grilla: 'casilla.prendiendoLasFogatas.png', alto: this.ladoCasilla, ancho: this.ladoCasilla });

        this.cuadricula.y = 0;

        window['actor'] = this.cuadricula;

        this.automata = new ScoutAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata,0, 0);
        this.completarConFogatasEnLaterales();

    }

    private completarConFogatasEnLaterales(){
        //Completo la primer y ultima fila
        for(var i=1; i<this.cantidadColumnas-1; ++i){
          this.agregarFogata(0, i);
          this.agregarFogata(this.cantidadFilas-1, i);
        }
        //Completo la primer y ultima columna
        for(var i=1; i<this.cantidadFilas-1; ++i){
          this.agregarFogata(i, 0);
          this.agregarFogata(i, this.cantidadColumnas-1);
        }

    }

    agregarFogata(fila, columna) {
      var fogata = new FogataAnimada(0, 0);
      this.cuadricula.agregarActor(fogata, fila, columna);
      this.compus.push(fogata);
    }

    estaResueltoElProblema() {
      return this.compus.every((fogata) => {
        fogata.nombreAnimacionActual() === 'prendida'
      });
    }

}
