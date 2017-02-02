/// <reference path = "LaberintoLargo.ts" />
/// <reference path="../actores/RatonAnimado.ts"/>

class LaberintoConQueso extends LaberintoLargo {

    iniciar() {
        super.iniciar();
        this.cuadricula.completarConObjetosRandom(new ConjuntoClases([QuesoAnimado]),
        {condiciones:
          [
            function(fila,col,pmatrix){return !(fila==0&&col==0)},
            function(fila,col,pmatrix){return (pmatrix[fila+1] != undefined && pmatrix[fila+1][col] == 'T') ||
                                              (pmatrix[fila][col+1] == 'T')
                                      }
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
