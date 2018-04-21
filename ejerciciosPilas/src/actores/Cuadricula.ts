/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Casilla.ts"/>

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
    cantFilas;
    cantColumnas;
    protected casillas: Array<Array<Casilla>>;
    private opcionesCuadricula;
    private opcionesCasilla;

    constructor(x, y, cantFilas, cantColumnas, opcionesCuadricula, opcionesCasilla) {
        this.cantFilas = cantFilas;
        this.cantColumnas = cantColumnas;
        this.sanitizarOpciones(opcionesCuadricula, opcionesCasilla);
        super(this.opcionesCuadricula.imagen, x, y, opcionesCuadricula);

        this.ancho = this.cantColumnas * opcionesCasilla.ancho + (this.separacion() * (this.cantColumnas - 1));
        this.alto = this.cantFilas * opcionesCasilla.alto + (this.separacion() * (this.cantFilas - 1));

        this.crearCasillas();
    }

    //TODO: Podría agregar que tome las dimensiones de la
    //imagen como último valor de ancho y alto por defecto
    sanitizarOpciones(opcionesCuadricula, opcionesCasilla) {
        this.opcionesCasilla = opcionesCasilla;
        this.opcionesCuadricula = opcionesCuadricula;

        this.opcionesCuadricula.imagen = this.opcionesCuadricula.imagen || 'invisible.png';
        this.opcionesCuadricula.ancho = this.opcionesCuadricula.ancho || pilas.opciones.ancho;
        this.opcionesCuadricula.alto = this.opcionesCuadricula.alto || pilas.opciones.alto;
        this.opcionesCuadricula.separacionEntreCasillas = this.opcionesCuadricula.separacionEntreCasillas || 0;
        this.opcionesCasilla.ancho = this.opcionesCasilla.ancho || this.calcularAnchoCasilla(this.opcionesCuadricula.ancho);
        this.opcionesCasilla.alto = this.opcionesCasilla.alto || this.calcularAltoCasilla(this.opcionesCuadricula.alto);
    }

    separacion(){
        return this.opcionesCuadricula.separacionEntreCasillas;
    }

    setAncho(nuevo) {
        this.ancho = nuevo;
        this.opcionesCasilla.ancho = this.calcularAnchoCasilla(nuevo);
        this.forEachCasilla(casilla => { casilla.reubicate() });
    }

    calcularAnchoCasilla(anchoCuad) {
        // anchoCuad = cols * anchoCas + ((cols-1) * separacion)
        // anchoCuad - ((cols-1) * separacion) = cols * anchoCas
        // anchoCas = (anchoCuad - ((cols-1) * separacion)) / cols
        // anchoCas = anchoCuad / cols - ((cols-1) * separacion) / cols
        return anchoCuad / this.cantColumnas -
            (((this.cantColumnas - 1) * this.separacion()) / this.cantColumnas);

    }

    setAlto(nuevo) {
        this.alto = nuevo;
        this.opcionesCasilla.alto = this.calcularAltoCasilla(nuevo);
        this.forEachCasilla(casilla => { casilla.reubicate() });
    }

    calcularAltoCasilla(altoCuad){
        var separacion = this.opcionesCuadricula.separacionEntreCasillas;
        return altoCuad / this.cantFilas -
                (((this.cantFilas - 1) * this.separacion()) / this.cantFilas);

    }

    forEachFila(func) {
        for (var nroFila = 0; nroFila < this.cantFilas; nroFila++){
            func(nroFila);
        }
    }

    forEachCol(func) {
        for (var nroCol = 0; nroCol < this.cantColumnas; nroCol++) {
            func(nroCol);
        }
    }

    forEachFilaCol(func) {
        this.forEachFila((nroFila) => 
            this.forEachCol((nroCol) =>
                func(nroFila, nroCol)
            )    
        );
					}
    
    forEachCasilla(func) {
        let i = 0;
        this.forEachFilaCol((nroFila, nroCol) => {
            if (this.casilla(nroFila,nroCol) !== undefined) {
                func(this.casilla(nroFila, nroCol), i);
                i += 1;
			}
        });
		}

    filterCasillas(pred) {
        let cumplen = [];
        this.forEachCasilla(casilla => {
            if (pred(casilla)) {
                cumplen.push(casilla);
            }
        });
        return cumplen;
    }

    crearCasillas(){
        this.casillas = new Array<Array<Casilla>>();
        this.forEachFilaCol((fila, col) =>
            this.agregarCasilla(fila, col)
				);
    }

    agregarCasilla(fila, col) {
        if (this.casillas[fila] === undefined) {
            this.casillas[fila] = new Array<Casilla>();
        }
        this.casillas[fila][col] = new Casilla(fila, col, this);
    }

    reemplazarCasilla(casillaVieja, casillaNueva) {
        this.casillas[casillaVieja.nroFila][casillaVieja.nroCol] = casillaNueva;
    }

    agregarActor(actor, nroF, nroC, escalarACasilla = true){
        this.agregarActorEnCasilla(actor, this.casilla(nroF, nroC), escalarACasilla);
		}

    agregarActorEnCasilla(actor, casilla, escalarACasilla = true) {
        actor.cuadricula = this;
        if (escalarACasilla){
        	actor.escalarProporcionalALimites(this.anchoCasilla() - 5, this.altoCasilla() - 5);
        }
        actor.setCasillaActual(casilla, true);
    }

    agregarActorEnPerspectiva(actor,nroF,nroC,escalarACasilla = true){
        this.agregarActor(actor, nroF, nroC, false);
        if (escalarACasilla) {
            actor.escalarAAncho(actor.casillaActual().ancho * 0.95);
        }
        actor.abajo = actor.casillaActual().abajo + (0.4 * this.altoCasilla())
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

    /**
     * Devuelve la casilla de la cuadrícula ubicada en la posición (nroF, nroC).
     * Si tal casilla no existe, devuelve undefined.
     */
    casilla(nroF, nroC){
        if (this.casillas[nroF] !== undefined) {
            return this.casillas[nroF][nroC];
        }
        else {
            return undefined;
        }
    }

    esFin(casilla){
      return this.cantFilas == 1 && casilla.sos(0, this.cantColumnas - 1) ||
          this.cantColumnas == 1 && casilla.sos(this.cantFilas - 1, 0);
    }

    esInicio(casilla){
      return casilla.sos(0, 0);
    }

    colisionan(objeto1, objeto2) {
      return (objeto1.casillaActual() == objeto2.casillaActual());
    }

    hayArriba(casilla : Casilla) : Boolean {
        return !(casilla.sos(0, null));
    }

    hayAbajo(casilla: Casilla): Boolean {
        return !(casilla.sos(this.cantFilas - 1, null));
    }

    hayIzquierda(casilla: Casilla): Boolean {
        return !(casilla.sos(null, 0));
    }

    hayDerecha(casilla : Casilla) : Boolean {
        return !(casilla.sos(null, this.cantColumnas - 1));
    }

    cantidadCasillas() {
        let cant = 0;
        this.forEachCasilla(casilla => cant += 1);
        return cant;
    }
}
