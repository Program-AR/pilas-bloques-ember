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
            (this.nroColumna * this.ancho);
    }
    
    reubicarEnY(){
        this.y = 
            this.cuadricula.arriba - 
            (this.alto / 2) - 
            (this.nroFila * this.alto);
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
}