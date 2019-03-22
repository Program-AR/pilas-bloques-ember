/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>

/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>


/**
 * @class TresNaranjas
 *
 */
class TresNaranjas extends EscenaActividad {
    fondo;
    automata;
    cuadricula;
    objetos = [];
    iniciar() {
        this.fondo = new Fondo('fondo.tresNaranjas.png',0,0);

        this.cuadricula = new Cuadricula(0,0,1,4,
            {separacionEntreCasillas: 5},
            {grilla: 'casilla.tresNaranjas.png', ancho:100,alto:100});

        //se cargan los Naranjas
        var hayAlMenosUno = false;
        for(var i = 0; i < 3; i++) {
            if (Math.random() < .5) {
                hayAlMenosUno = true;
                this.agregarNaranja(i+1);
            }
        }
        if (!hayAlMenosUno) {
            var columna = 1;
            var rand = Math.random()
            if (rand> 0.33 && rand<0.66) {
                columna = 2;
            } else if (rand > 0.66) {
                columna = 3
            }
            this.agregarNaranja(columna);
        }

        // se crea el personaje
        this.automata = new MarcianoAnimado(0,0);
        this.cuadricula.agregarActor(this.automata,0,0,false);
				this.automata.y += 20;
				this.automata.x -= 20;
    }

    agregarNaranja(columna) {
        var naranja = new NaranjaAnimada(0,0);
        this.cuadricula.agregarActor(naranja,0,columna,false);
				naranja.escala = 0.5;
				naranja.x += 20;
				naranja.y -= 20;
        this.objetos.push(naranja);
    }

    estaResueltoElProblema(){
      return this.contarActoresConEtiqueta('NaranjaAnimada')==0 && this.automata.estaEnCasilla(null,3);
    }


}
