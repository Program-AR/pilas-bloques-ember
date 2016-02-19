/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/MariaAnimada.ts" />
/// <reference path = "../actores/Cuadricula.ts" />


class MariaLaComeSandias extends EscenaActividad {
    cuadricula;
    cantidadColumnas;
    fondo;

    iniciar() {
        this.fondo = new Fondo('fondo.mariaSandia.png',0,0);
        var cantidadFilas=5
        this.cantidadColumnas=6
        this.cuadricula = new Cuadricula(0,0,cantidadFilas,this.cantidadColumnas,
            {alto: 300,ancho:300,separacionEntreCasillas: 5},
            {grilla: 'casilla.mariaSandia.png',
            cantColumnas: 5})
        this.completarConSandias();
        this.automata = new MariaAnimada(0, 0);
        this.cuadricula.agregarActor(this.automata,cantidadFilas-1, 0);
        this.automata.escala *= 2
        this.automata.abajo = this.cuadricula.casilla(cantidadFilas - 1, 0).abajo;
    }

    private completarConSandias(){
        this.completarFila(0);
        this.completarFila(2);
        this.completarFila(4);
        this.cuadricula.agregarActor(new SandiaAnimada(0, 0), 1, 0);
        this.cuadricula.agregarActor(new SandiaAnimada(0, 0), 3, 0);
    }

    private completarFila(numeroFila){
        for (var x = 0; x < this.cantidadColumnas;x++){
            this.cuadricula.agregarActor(new SandiaAnimada(0, 0), numeroFila, x);
        }
    }

    estaResueltoElProblema() {
        return this.contarActoresConEtiqueta('SandiaAnimada')==0;
    }
}
