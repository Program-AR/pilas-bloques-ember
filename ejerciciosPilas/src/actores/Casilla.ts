/// <reference path = "../../dependencias/pilasweb.d.ts"/>

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
        
        super(0,0,{grilla: this.cuadricula.opciones.grillaCasilla || "invisible.png", 
                   cantCuadros: this.cuadricula.opciones.cantCuadrosCasilla});
        
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
            (this.nroColumna * this.ancho);
    }
    
    reubicarEnY(){
        this.y = 
            this.cuadricula.arriba - 
            (this.alto / 2) - 
            (this.nroFila * this.alto);
    }
    
    actualizarAncho(){
        this.ancho = this.cuadricula.opciones.anchoCasilla;
    }
    
    actualizarAlto(){
        this.alto = this.cuadricula.opciones.altoCasilla;
    }
}