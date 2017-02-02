/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Tito.ts" />
/// <reference path = "../actores/Lamparin.ts" />
/// <reference path = "../actores/CuadriculaEsparsa.ts" />

class TitoCuadrado extends EscenaActividad {
  fondo;
  cantidadFilas;
  cantidadColumnas;
  luces;

  iniciar() {
      this.fondo = new Fondo('fondo.tito-cuadrado.png',0,0);
      this.luces = [];
      this.cantidadFilas=7;
      this.cantidadColumnas=7;
      var matriz= [
        ['T','T','T','T','T','T','T'],
        ['T','F','F','F','F','F','T'],
        ['T','F','F','F','F','F','T'],
        ['T','F','F','F','F','F','T'],
        ['T','F','F','F','F','F','T'],
        ['T','F','F','F','F','F','T'],
        ['T','T','T','T','T','T','T']
        ]
      this.cuadricula = new CuadriculaEsparsa(0,0,{ancho: 400, alto: 400},{grilla:'casillas.violeta.png'},matriz)

      this.agregarLuces();

      this.automata = new Tito(0,0);
      this.cuadricula.agregarActorEnPerspectiva(this.automata,0,0);
      this.automata.escala *= 1.5;
    }

    private agregarLuces(){
      for(var i=1;i<this.cantidadColumnas-1;i++){
        if (Math.random() < .5) {
          this.agregarLuz(0,i);
          //filaSuperior
      }
      if (Math.random() < .5) {
        this.agregarLuz(this.cantidadFilas-1,i);
      }
      //filaInferior
    }

    for(var j=1;j<this.cantidadFilas-1;j++){
      if (Math.random() < .5) {
        this.agregarLuz(j,0);
      }
      if (Math.random() < .5) {
        this.agregarLuz(j,this.cantidadColumnas-1);
      }
    }
  }

  private agregarLuz(f,c) {
    var luz = new Lamparin(0,0);
    this.luces.push(luz);
    this.cuadricula.agregarActor(luz,f,c);
  }

  estaResueltoElProblema() {
      return this.luces.every(l => l.nombreAnimacionActual() == 'prendida');
  }
}
