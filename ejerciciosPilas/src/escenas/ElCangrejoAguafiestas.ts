/// <reference path = "EscenaActividad.ts" />
/// <reference path="../comportamientos/RecogerPorEtiqueta.ts"/>
/// <reference path="../actores/CuadriculaEsparsa.ts"/>
/// <reference path="../actores/GloboAnimado.ts"/>
/// <reference path="../actores/CangrejoAnimado.ts"/>
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}

  class ElCangrejoAguafiestas extends EscenaActividad {
    fondo;
    cuadricula;
    automata;
    cantidadFilas;
    cantidadColumnas;
    iniciar() {
        this.fondo = new Fondo('fondo.cangrejo_aguafiestas',0,0);
        this.cantidadFilas=5;
        this.cantidadColumnas=6;
        var matriz= [
          ['T','T','T','T','T','T'],
          ['T','F','F','F','F','T'],
          ['T','T','T','T','T','T'],
          ['T','F','F','F','F','T'],
          ['T','T','T','T','T','T']]
        this.cuadricula = new CuadriculaEsparsa(0,0,{alto: 400, ancho:400},{grilla:'casilla.cangrejo_aguafiestas.png'},matriz)
        this.completarConGlobos();
        this.automata = new CangrejoAnimado(0,0);
        this.cuadricula.agregarActor(this.automata,0,0);
      }

    private completarConGlobos(){
      this.cuadricula.casillas.forEach(c => this.agregarGlobo(c.nroFila,c.nroColumna));
    }

    private agregarGlobo(fila,col){
      var globo = new GloboAnimado();
      this.cuadricula.agregarActor(globo,fila,col,false);
      globo.y += 30;
      globo.escala *= 0.8;
      globo.aprender(Flotar,{Desvio:5});
    }
}
