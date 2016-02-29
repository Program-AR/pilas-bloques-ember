/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ActorAnimado.ts"/>
/// <reference path = "Cuadricula.ts"/>

/**
 * @class Casilla
 * Este actor no puede funcionar sólo. Siempre funciona y es creado desde
 * el actor Cuadricula. Todo su comportamiento depende de ella.
 */

class Casilla extends ActorAnimado {
    cuadricula;
    nroFila;
    nroColumna;

    constructor(nroF, nroC, cuadricula) {
        this.cuadricula = cuadricula;
        this.nroFila = nroF;
        this.nroColumna = nroC;

        super(0, 0, cuadricula.getOpcionesCasilla());

        this.reubicate();
    }

    reubicate() {
        this.actualizarAncho();
        this.actualizarAlto();
        this.reubicarEnX();
        this.reubicarEnY();
    }

    reubicarEnX() {
        this.x =
            this.cuadricula.izquierda +
            (this.ancho / 2) +
            (this.nroColumna * (this.ancho + this.cuadricula.separacion()));
    }

    reubicarEnY() {
        this.y =
            this.cuadricula.arriba -
            (this.alto / 2) -
            (this.nroFila * (this.alto + this.cuadricula.separacion()));
    }

    actualizarAncho() {
        this.ancho = this.cuadricula.anchoCasilla();
    }

    actualizarAlto() {
        this.alto = this.cuadricula.altoCasilla();
    }

    casillaASuDerecha() {
        return this.cuadricula.casilla(this.nroFila, this.nroColumna + 1);
    }
    casillaASuIzquierda() {
        return this.cuadricula.casilla(this.nroFila, this.nroColumna - 1);
    }
    casillaDeArriba() {
        return this.cuadricula.casilla(this.nroFila - 1, this.nroColumna);
    }
    casillaDeAbajo() {
        return this.cuadricula.casilla(this.nroFila + 1, this.nroColumna);
    }
    sos(nroF, nroC) {
        return nroF == this.nroFila && nroC == this.nroColumna;
    }

    esEsquina(){
        return this.sos(0, 0) ||
            this.sos(0, this.cuadricula.cantColumnas - 1) ||
            this.sos(this.cuadricula.cantFilas - 1, 0) ||
            this.sos(this.cuadricula.cantFilas - 1, this.cuadricula.cantColumnas - 1);
    }

    esFin(){
        return this.cuadricula.cantFilas == 1 && this.sos(0, this.cuadricula.cantColumnas - 1) ||
            this.cuadricula.cantColumnas == 1 && this.sos(this.cuadricula.cantFilas - 1, 0);
    }

    cambiarImagen(nombre, cantFilas = 1, cantColumnas = 1){ // TODO: FEOOOOOOO bugfix setter imagen del actor
        // PARCHEEEEE
        this.renacer(nombre, cantFilas, cantColumnas);
    }

    renacer(nombreImagen, cantFilas = 1, cantColumnas = 1) { // TODO: FEOOOOOOO bugfix setter imagen del actor
        // POR FAVOR YO FUTURO PERDONAME
        this.eliminar();
        
        var opsCasilla = {
            grilla: this.cuadricula.opcionesCasilla.grilla,
            cantFilas: this.cuadricula.opcionesCasilla.cantFilas,
            cantColumnas: this.cuadricula.opcionesCasilla.cantColumnas,
        };
        
        this.cuadricula.opcionesCasilla.grilla = nombreImagen;
        this.cuadricula.opcionesCasilla.cantFilas = cantFilas;
        this.cuadricula.opcionesCasilla.cantColumnas = cantColumnas;

        var nuevoYo = new Casilla(this.nroFila,this.nroColumna,this.cuadricula);
        
        this.cuadricula.opcionesCasilla.grilla = opsCasilla.grilla;
        this.cuadricula.opcionesCasilla.cantFilas = opsCasilla.cantFilas;
        this.cuadricula.opcionesCasilla.cantColumnas = opsCasilla.cantColumnas;

        this.cuadricula.casillas[this.cuadricula.casillas.indexOf(this)] = nuevoYo;
    }
}
