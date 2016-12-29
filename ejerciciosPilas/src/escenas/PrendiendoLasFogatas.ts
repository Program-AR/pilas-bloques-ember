/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/ScoutAnimado.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/CompuAnimada.ts" />

class PrendiendoLasFogatas extends EscenaActividad {
    cuadricula;
    ladoCasilla;
    fogatas;
    cantidadFilas;
    cantidadColumnas;

    iniciar() {
        this.fogatas = [];
        this.cantidadFilas = 7;
        this.cantidadColumnas = 7;

        let matriz = [
          ['T','T','T','T','T','T','T'],
          ['T','F','F','F','F','F','T'],
          ['T','F','F','F','F','F','T'],
          ['T','F','F','F','F','F','T'],
          ['T','F','F','F','F','F','T'],
          ['T','F','F','F','F','F','T'],
          ['T','T','T','T','T','T','T']
        ];

        this.cuadricula = new CuadriculaEsparsa(0,0, {ancho: 400, alto: 400}, {grilla: 'casillas.violeta.png'}, matriz)

        this.ladoCasilla = 30;
        this.fondo = new Fondo('fondo.BosqueDeNoche.png', 0, 0);

        this.agregarFogatas();

        this.automata = new ScoutAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0);
    }

    private agregarFogatas() {

      for (var i=1; i<this.cantidadColumnas-1; i++){
        if (Math.random() < .5) {
          this.agregarFogata(0, i);
          //filaSuperior
        }
        if (Math.random() < .5) {
          this.agregarFogata(this.cantidadFilas-1, i);
        }
        //filaInferior
      }

      for (var j=1; j<this.cantidadFilas-1; j++){

        if (Math.random() < .5) {
          this.agregarFogata(j, 0);
        }

        if (Math.random() < .5) {
          this.agregarFogata(j, this.cantidadColumnas-1);
        }
      }
    }

    private agregarFogata(fila, columna) {
      let fogata = new FogataAnimada(0, 0);
      this.cuadricula.agregarActor(fogata, fila, columna);
      this.fogatas.push(fogata);
    }

    estaResueltoElProblema() {
      return this.fogatas.every((fogata) => {
        return (fogata.nombreAnimacionActual() === 'prendida');
      });
    }

}
