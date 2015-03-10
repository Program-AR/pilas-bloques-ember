/// <reference path = "../../dependencias/pilasweb.d.ts"/>


/**
 * class @Cuadricula
 * 
 * Este actor sirve para dibujar una cuadrícula en pantalla, que
 * tenga casillas.
 * 
 * Cada casilla tiene la misma grilla (y el cuadro que se muestre puede variar en cada una)
 * Las opciones del Actor cuadrícula son el 5to parámetro.
 * Las opciones del CADA CASILLA son el 6to parámetro. Estas opciones son exactamente
 * las mismas que para cualquier ActorAnimado.
 * 
 * Hay varias maneras de crear la cuadrícula.
 * 
 * Por ejemplo, si quiero crear una cuadrícula así:
 *     una banana (sprite de 2 cuadros), ubicada en 0,0, con 3 filas y 4 columnas,
 *     que ocupe toda la pantalla.
 * lo hago así:
 *     new Cuadricula(0,0,3,4,{}
 *           {grilla: 'banana.png', 
 *           cantColumnas: 2})
 * 
 * Si no se especifica ningún tipo de medida, se toma la de toda la pantalla.
 
 * Ahora, si quiero lo mismo pero con casillas de 50 x 100,
 * lo hago así:
 *     new Cuadricula(0,0,3,4,{}
 *           {grilla: 'banana.png', 
 *           cantColumnas: 2, 
 *           ancho: 50, 
 *           alto: 100})
 * 
 * Otro ejemplo, si quiero crear una cuadrícula igual que las anteriores, 
 * pero definiendo el ancho y alto totales de la cuadrícula
 *     (y no de cada casilla) como de 300 x 300
 * lo hago así:
 *     new Cuadricula(0,0,3,4,
 *           {ancho: 300, 
 *           alto: 300},
 *           {grilla: 'banana.png', 
 *           cantColumnas: 2})
 *  
 * Nótese que esta vez las opciones que se eligieron son las de la cuadrícula, y
 * no las de la casilla.
 * 
 * IMPORTANTE:
 *   No usar cuadricula.ancho = 300 para cambiar el ancho de la cuadrícula.
 *   Usar en vez de ello cuadricula.setAncho(300);
 *   Idem con el alto. 
 *   Aunque claro que lo mejor es crearla directamente con las opciones.
 */

class Cuadricula extends Actor {
    private cantFilas;
    private cantColumnas;
    protected casillas: Array<Casilla>;
    private opcionesCuadricula;
    private opcionesCasilla;
    
    constructor(x, y, cantFilas, cantColumnas, opcionesCuadricula, opcionesCasilla){
        this.cantFilas = cantFilas;
        this.cantColumnas = cantColumnas;
        super('invisible.png',x,y,opcionesCuadricula);

        this.sanitizarOpciones(opcionesCuadricula, opcionesCasilla);
        this.ancho = this.cantColumnas * opcionesCasilla.ancho;
        this.alto = this.cantFilas * opcionesCasilla.alto;
        
        this.crearCasillas();
    }
    
    //TODO: Podría agregar que tome las dimensiones de la 
    //imagen como último valor de ancho y alto por defecto
    sanitizarOpciones(opcionesCuadricula, opcionesCasilla){
        this.opcionesCasilla = opcionesCasilla;
        this.opcionesCuadricula = opcionesCuadricula;
        this.opcionesCuadricula.ancho = this.opcionesCuadricula.ancho || pilas.opciones.ancho;
        this.opcionesCuadricula.alto = this.opcionesCuadricula.alto || pilas.opciones.alto;
        this.opcionesCasilla.ancho = this.opcionesCasilla.ancho || this.opcionesCuadricula.ancho / this.cantColumnas ;
        this.opcionesCasilla.alto = this.opcionesCasilla.alto || this.opcionesCuadricula.alto / this.cantFilas;
    }
    
    setAncho(nuevo){
        this.ancho = nuevo;
        this.opcionesCasilla.ancho = nuevo / this.cantColumnas;
        this.casillas.forEach(casilla => {casilla.reubicate()});
    }
    
    setAlto(nuevo){
        this.alto = nuevo;
        this.opcionesCasilla.alto = nuevo / this.cantFilas;
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
        return this.opcionesCasilla.alto;
    }
    anchoCasilla(){
        return this.opcionesCasilla.ancho;
    }
    
    getOpcionesCasilla(){
        return this.opcionesCasilla;
    }
    
    casilla(nroF, nroC){
        return this.casillas.filter(casilla => casilla.sos(nroF,nroC))[0];
    }

}