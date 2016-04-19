/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/InstaladorAnimado.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/CompuAnimada.ts" />

class PrendiendoLasCompus extends EscenaActividad {
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
        this.fondo = new Fondo('fondo.prendiendoLasCompus.png', 0, 0);

        this.cantidadFilas = Math.floor(this.cantidadMinFilas + (Math.random() * (this.cantidadMaxFilas - this.cantidadMinFilas)));
        this.cantidadColumnas = Math.floor(this.cantidadMinColumnas + (Math.random() * (this.cantidadMaxColumnas - this.cantidadMinColumnas)));
        this.cuadricula = new Cuadricula(0, (this.ladoCasilla + 2) * 2, this.cantidadFilas, this.cantidadColumnas,
            { separacionEntreCasillas: 2 },
            { grilla: 'casilla.prendiendoLasCompus.png', alto: this.ladoCasilla, ancho: this.ladoCasilla });

        this.automata = new InstaladorAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata,0, 0);
        this.completarConCompusEnLaterales();

    }

    private completarConCompusEnLaterales(){
        //Completo la primer y ultima fila
        for(var i=1;i<this.cantidadColumnas-1;++i){
          this.addCompu(0,i);
          this.addCompu(this.cantidadFilas-1,i);
        }
        //Completo la primer y ultima columna
        for(var i=1;i<this.cantidadFilas-1;++i){
          this.addCompu(i,0);
          this.addCompu(i,this.cantidadColumnas-1);
        }

    }

    addCompu(fila, columna){
      var compu = new CompuAnimada(0,0);
      this.cuadricula.agregarActor(compu,fila,columna);
      this.compus.push(compu);
    }

    estaResueltoElProblema(){
      return this.compus.every(compu => compu.nombreAnimacionActual() === 'prendida');
    }

}
