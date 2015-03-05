/// <reference path = "../../dependencias/pilasweb.d.ts"/>


/**
 * class @Cuadricula
 * 
 * Este actor sirve para dibujar una cuadrícula en pantalla, que
 * tenga casillas.
 * 
 * Cada casilla tiene la misma grilla (y el cuadro que se muestre puede variar en cada una)
 * 
 * Hay varias maneras de crear la cuadrícula.
 * 
 * Por ejemplo, si quiero crear una cuadrícula así:
 *     una banana (sprite de 2 cuadros), ubicada en 0,0, con 3 filas y 4 columnas,
 *     que ocupe toda la pantalla.
 * lo hago así:
 *     new Cuadricula(0,0,3,4,
 *           {grillaCasilla: 'banana.png', 
 *           cantCuadrosCasilla: 2})
 * 
 * Si no se especifica ningún tipo de medida, se toma la de toda la pantalla.
 
 * Ahora, si quiero lo mismo pero con casillas de 50 x 100,
 * lo hago así:
 *     new Cuadricula(0,0,3,4,
 *           {grillaCasilla: 'banana.png', 
 *           cantCuadrosCasilla: 2, 
 *           anchoCasilla: 50, 
 *           altoCasilla: 100})
 * 
 * Otro ejemplo, si quiero crear una cuadrícula igual que las anteriores, 
 * pero definiendo el ancho y alto totales de la cuadrícula
 *     (y no de cada casilla) como de 300 x 300
 * lo hago así:
 *     new Cuadricula(0,0,3,4,
 *           {grillaCasilla: 'banana.png', 
 *           cantCuadrosCasilla: 2, 
 *           ancho: 300, 
 *           alto: 300})
 *  
 * IMPORTANTE:
 *   No usar cuadricula.ancho = 3 para cambiar el ancho de la cuadrícula.
 *   Usar en vez de ello cuadricula.setAncho(3);
 *   Idem con el alto.
 */

class Cuadricula extends Actor {
    cantFilas;
    cantColumnas;
    casillas: Array<Casilla>;
    opciones;
    
    constructor(x, y, cantFilas, cantColumnas, opciones){
        this.cantFilas = cantFilas;
        this.cantColumnas = cantColumnas;
        super('invisible.png',x,y,this.opciones);

        this.sanitizarOpciones(opciones);
        this.ancho = this.cantColumnas * opciones.anchoCasilla;
        this.alto = this.cantFilas * opciones.altoCasilla;
        
        this.crearCasillas();
    }
    
    //TODO: Podría agregar que tome las dimensiones de la 
    //imagen como último valor de ancho y alto por defecto
    sanitizarOpciones(opciones){
        this.opciones = opciones;
        this.opciones.ancho = this.opciones.ancho || pilas.opciones.ancho;
        this.opciones.alto = this.opciones.alto || pilas.opciones.alto;
        this.opciones.anchoCasilla = this.opciones.anchoCasilla || this.opciones.ancho / this.cantColumnas ;
        this.opciones.altoCasilla = this.opciones.altoCasilla || this.opciones.alto / this.cantFilas;
    }
    
    setAncho(nuevo){
        this.ancho = nuevo;
        this.opciones.anchoCasilla = nuevo / this.cantColumnas;
        this.casillas.forEach(casilla => {casilla.reubicate()});
    }
    
    setAlto(nuevo){
        this.alto = nuevo;
        this.opciones.altoCasilla = nuevo / this.cantFilas;
        this.casillas.forEach(casilla => {casilla.reubicate()});
    }
    
    crearCasillas(){
        this.casillas = new Array<Casilla>();
        for(var nroFila=0; nroFila < this.cantFilas; nroFila++){
            for(var nroColumna=0; nroColumna < this.cantColumnas; nroColumna++){
                this.casillas.push( 
                    new Casilla(nroFila,nroColumna, this));
            }
        }
    }
    
    altoCasilla(){
        return this.opciones.altoCasilla();
    }
    anchoCasilla(){
        return this.opciones.anchoCasilla();
    }
    
    casilla(nroF, nroC){
        return this.casillas.filter(casilla => casilla.sos(nroF,nroC))[0];
    }

}