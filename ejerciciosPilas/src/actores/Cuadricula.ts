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
 * Por último, en lugar de especificar el ancho y el alto de las casillas,
 * se puede indicar una relación de aspecto deseada para las casillas.
 * Debe ser un número que indique el cociente anchoCasilla/altoCasilla deseado.
 * Por ejemplo, para crear una cuadrícula con casillas cuadradas de a lo sumo
 * 300 píxeles de ancho y 300 píxeles de alto:
 *     new Cuadricula(0,0,3,4,
 *           {ancho: 300,
 *           alto: 300},
 *           {grilla: 'banana.png',
 *           cantColumnas: 2,
 *           relAspecto: 1})
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
    private casillas: Array<Array<Casilla>>;
    private primeraCasillaLibre : [number, number];
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
        if (this.opcionesCasilla.relAspecto) {
            this.opcionesCasilla.ancho = this.opcionesCasilla.ancho || this.calcularAnchoCasillaConRelAspecto(this.opcionesCasilla.relAspecto, this.opcionesCuadricula.ancho, this.opcionesCuadricula.alto);
            this.opcionesCasilla.alto = this.opcionesCasilla.alto || this.calcularAltoCasillaConRelAspecto(this.opcionesCasilla.relAspecto, this.opcionesCuadricula.ancho, this.opcionesCuadricula.alto);
        }
        else {
            this.opcionesCasilla.ancho = this.opcionesCasilla.ancho || this.calcularAnchoCasilla(this.opcionesCuadricula.ancho);
            this.opcionesCasilla.alto = this.opcionesCasilla.alto || this.calcularAltoCasilla(this.opcionesCuadricula.alto);
        }
    }

    separacion(){
        return this.opcionesCuadricula.separacionEntreCasillas;
    }

    reubicarCasillas() : void {
        this.forEachCasilla(casilla => { casilla.reubicate() });
    }

    setX(x) {
        super.setX(x);
        this.reubicarCasillas();
    }

    setY(y) {
        super.setY(y);
        this.reubicarCasillas();
    }

    setAncho(nuevo) {
        this.ancho = nuevo;
        this.opcionesCasilla.ancho = this.calcularAnchoCasilla(nuevo);
        this.reubicarCasillas();
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
        this.reubicarCasillas();
    }

    calcularAltoCasilla(altoCuad) {
        return altoCuad / this.cantFilas -
                (((this.cantFilas - 1) * this.separacion()) / this.cantFilas);

    }

    calcularAnchoCasillaConRelAspecto(relAspecto, anchoCuad, altoCuad) : number {
        return Math.min(this.calcularAnchoCasilla(anchoCuad), this.calcularAltoCasilla(altoCuad) * relAspecto)
    }

    calcularAltoCasillaConRelAspecto(relAspecto, anchoCuad, altoCuad) : number {
        return Math.min(this.calcularAltoCasilla(altoCuad), this.calcularAnchoCasilla(anchoCuad) / relAspecto)
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
    
    /**
     * Itera sobre todas las casillas de la cuadrícula y aplica la función
     * recibida por parámetro. Las casillas se recorren *ordenadamente*,
     * de izquierda a derecha y de arriba hacia abajo.
     * @param func Función que se aplica a cada casilla. Recibe hasta
     * dos parámetros: la casilla sobre la que se está iterando y un
     * índice que se incrementa con cada casilla.
     */
    forEachCasilla(func : (Casilla, number) => any) {
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

    agregarActorEnProximaCasillaLibre(actor, escalarACasilla = true) {
        let casillaDestino = this.proximaCasillaLibre();
        if (casillaDestino) {
            this.agregarActorEnCasilla(actor, this.proximaCasillaLibre(), escalarACasilla);
        }
        else {
            throw Error("Ya no quedan casillas libres");
        }
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

    proximaCasillaLibre() : Casilla {
        return this.filterCasillas(casilla => casilla.estaLibre())[0];
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

    /**
     * Este método sirve para llenar una cuadrícula de elementos 
     * a partir de una matriz que la describe.  
     * Se pensó originalmente para realizar un camino al estilo de
     * las actividades iniciales de code.org, con varios obstáculos.
     * @param matrizContenido Es una matriz de 2 dimensiones.
     * Cada contenido puede ser un string, que es el identificador del actor que irá en cada casilla.  
     * Por ejemplo se puede usar una letra 'A' para identificar al autómata.  
     * Los strings vacíos y el caracter espacio ' ' significa "casilla libre".  
     * Si el string finaliza en un signo de interrogación ('?'), se decidirá si
     * colocar o no el actor de manera aleatoria.
     * @param diccionarioContenido Diccionario que mapea cada identificador con la función que obtiene a cada actor.
     * Importante: el actor debe crearse AL LLAMAR A ESA FUNCION, y no antes.  
     * La función recibirá dos parámetros: el número de fila y el número de columna
     * de la casilla donde se colocará el actor, respectivamente.  
     * Se puede usar el identificador 'default' para brindar una función a utilizar
     * cuando la matriz contiene un código que no está presente en el diccionario. La función
     * recibirá dicho código como primer parámetro.
     * @param proba Número entre 0 y 1.
     * Indica la probabilidad con la que se colocan los actores indicados como aleatorios.
     * El valor por defecto es 0.5.
     */
    autollenar(matrizContenido : Array<Array<string>>, diccionarioContenido, proba : number = 0.5) : void {
        this.forEachCasilla((casilla : Casilla) => {
            let nroFila = casilla.nroFila;
            let nroColumna = casilla.nroColumna;
            let codigo = matrizContenido[nroFila][nroColumna];

            if (codigo == '' || codigo == ' ') return; // si es casilla libre
    
            if (codigo.slice(-1) == '?') { // si debe ser randomizado 
                codigo = codigo.slice(0, -1);
                if (Math.random() > proba) return;
            }

            let actor;
            if (codigo in diccionarioContenido) {
                actor = diccionarioContenido[codigo](nroFila, nroColumna);
            }
            else if ('default' in diccionarioContenido) {
                actor = diccionarioContenido['default'](codigo, nroFila, nroColumna);
            }
            else {
                throw Error("Código de actor no definido en diccionarioContenido");
            }
            
            this.agregarActorEnCasilla(actor, casilla, true);
        });
    }
}
