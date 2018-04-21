/// <reference path = "LaberintoLargo.ts" />
/// <reference path="../actores/RatonAnimado.ts"/>

class LaberintoConQueso extends LaberintoLargo {

    iniciar() {
        super.iniciar();
        this.cuadricula.completarConObjetosRandom(new ConjuntoClases([QuesoAnimado]),
        {condiciones:
          [
            (casilla) => casilla.hayAbajo() || casilla.hayDerecha()
          ]
        });
        this.automata.setZ(pilas.escena_actual().minZ() - 1);
    }


     dameOpcionesCuadricula(){
      return {'alto':440,'ancho':400, 'largo_min':3, 'largo_max':15};
    }

    nombreFondo(){
      return 'fondo.laberinto.queso.png';
    }

    estaResueltoElProblema(){
      return this.automata.alFinalDelCamino()&&this.contarActoresConEtiqueta('QuesoAnimado')==0;
    }
}
