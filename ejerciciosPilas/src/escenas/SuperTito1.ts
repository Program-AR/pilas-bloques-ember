/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Tito.ts"/>
/// <reference path = "../actores/Lamparin.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>

/**
 * @class SuperTito1
 *
 */
class SuperTito1 extends EscenaActividad {
    fondo;
    automata;
    cuadricula;
    cantFilas;
    objetos;

    iniciar() {
        this.fondo = new Fondo(this.pathFondo(),0,0);
        this.objetos = [];
        this.cuadricula = new Cuadricula(0,0,this.cantidadFilas(),1,
            {separacionEntreCasillas: 5},
            {grilla: 'casilla.grisoscuro.png',
            cantColumnas: 1,  ancho:100, alto:50});
        this.cuadricula.casilla(this.cantidadFilas()-1,0).cambiarImagen('casilla.titoFinalizacion.png');
        
        for (let i = 0; i < this.cantidadFilas()-1; i++) {
            this.agregarLamparinEnFila(i);
        }
        this.automata = new Tito(0,0);
        this.cuadricula.agregarActor(this.automata,0,0);
        this.automata.escala *= 2;
        this.automata.y += 30;
        this.automata.x -= 15;

    }

    cantidadFilas() { 
        if (!this.cantFilas) this.cantFilas = Math.floor((Math.random() * 5) + 3);
        return this.cantFilas;
    }

    agregarLamparinEnFila(i){
        var lamparin = new Lamparin(0, 0);
        this.objetos.push(lamparin);
        this.cuadricula.agregarActor(lamparin, i, 0);
        lamparin.x += 15;
    }

    pathFondo(){
        return 'fondo.superTito1.png';
    }

    estaResueltoElProblema() {
        return this.objetos.every(o => o.nombreAnimacionActual() == 'prendida');
    }

}
