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
    actores;

    constructor(nroF, nroC, cuadricula) {
        this.cuadricula = cuadricula;
        this.nroFila = nroF;
        this.nroColumna = nroC;
        this.actores = [];

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
        return this.cuadricula.esFin(this);
    }

    esInicio(){
        return this.cuadricula.esInicio(this);
    }

    // Este método sólo genera una referencia entre la casilla y el actor.
    // Si quiero generar la relación bidireccional no debo usar este, sino actor.setCasillaActual(c).
    agregarActor(unActor){
      this.actores.push(unActor);
    }

    eliminarActor(unActor){
      this.actores.splice(this.actores.indexOf(unActor),1);
    }

    tieneActorConEtiqueta(unaEtq){
      return this.actores.any( actor => actor.tiene_etiqueta(unaEtq))
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
