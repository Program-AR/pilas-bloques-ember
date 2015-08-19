/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/ActorAnimado.ts"/>

/**
 * @class Casilla
 * Este actor no puede funcionar sólo. Siempre funciona y es creado desde
 * el actor Cuadricula. Todo su comportamiento depende de ella.
 */

class Casilla extends ActorAnimado {
    cuadricula;
    nroFila;
    nroColumna;

    constructor(nroF,nroC,cuadricula){
        this.cuadricula = cuadricula;
        this.nroFila = nroF;
        this.nroColumna = nroC;

        super(0,0,cuadricula.getOpcionesCasilla());

        this.reubicate();
    }

    reubicate(){
       this.actualizarAncho();
       this.actualizarAlto();
       this.reubicarEnX();
       this.reubicarEnY();
    }

    reubicarEnX(){
        this.x =
            this.cuadricula.izquierda +
            (this.ancho / 2) +
            (this.nroColumna * (this.ancho + this.cuadricula.separacion()));
    }

    reubicarEnY(){
        this.y =
            this.cuadricula.arriba -
            (this.alto / 2) -
            (this.nroFila * (this.alto + this.cuadricula.separacion()));
    }

    actualizarAncho(){
        this.ancho = this.cuadricula.anchoCasilla();
    }

    actualizarAlto(){
        this.alto = this.cuadricula.altoCasilla();
    }

    casillaASuDerecha(){
        return this.cuadricula.casilla(this.nroFila,this.nroColumna + 1);
    }
    casillaASuIzquierda(){
        return this.cuadricula.casilla(this.nroFila,this.nroColumna - 1);
    }
    casillaDeArriba(){
        return this.cuadricula.casilla(this.nroFila - 1,this.nroColumna);
    }
    casillaDeAbajo(){
        return this.cuadricula.casilla(this.nroFila + 1,this.nroColumna);
    }
    sos(nroF,nroC){
        return nroF == this.nroFila && nroC == this.nroColumna;
    }

    cambiarImagen(nombre){ // TODO: FEOOOOOOO bugfix setter imagen del actor
        // PARCHEEEEE
        this.renacer(nombre);
    }

    renacer(nombreImagen){ // TODO: FEOOOOOOO bugfix setter imagen del actor
        // POR FAVOR YO FUTURO PERDONAME
        var pos = this.cuadricula.casillas.indexOf(this);
        this.cuadricula.casillas.slice(pos,pos+1);
        this.eliminar();
        
        var grillaCasilla = this.cuadricula.opcionesCasilla.grilla;
        this.cuadricula.opcionesCasilla.grilla = nombreImagen;
        var nuevoYo = new Casilla(this.nroFila,this.nroColumna,this.cuadricula);
        this.cuadricula.opcionesCasilla.grilla = grillaCasilla;

        this.cuadricula.casillas.push(nuevoYo);
    }
}
