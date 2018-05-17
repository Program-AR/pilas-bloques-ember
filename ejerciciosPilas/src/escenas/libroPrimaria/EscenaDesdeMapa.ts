/// <reference path = "../../../dependencias/pilasweb.d.ts" />
/// <reference path = "../EscenaActividad.ts" />
/// <reference path = "../../actores/Cuadricula.ts" />
/// <reference path = "../../actores/FlechaEscenarioAleatorio.ts" />

type MapaEscena = Array<Array<string>>;
type MapeoCuadricula = { [id: string]: (f?: number, c?: number, codigo?: string) => ActorAnimado };

/**
 * Esta escena consta de una cuadrícula que se puede llenar de actores
 * automáticamente a partir de un mapa, es decir, una matriz que la describe.  
 * Se pensó originalmente para realizar un camino al estilo de las actividades
 * iniciales de code.org, con varios obstáculos.
 * 
 * Los mapas son matrices de dos dimensiones. Cada elemento puede ser un string,
 * que es el identificador del actor que irá en cada casilla.  
 * Por ejemplo, se puede usar una letra 'A' para identificar al autómata.  
 * Los strings vacíos y el caracter espacio ' ' significa "casilla libre".  
 * Si el string finaliza en un signo de interrogación ('?'),
 * se decidirá si colocar o no el actor de manera aleatoria.
 */
abstract class EscenaDesdeMapa extends EscenaActividad {
    mapaEscena : MapaEscena;
    generadorDeMapas : GeneradorDeMapas;
    proba : number;

    /**
     * @param generadorDeMapas El generador que se utilizará para obtener mapas para la actividad.
     * @param proba Número entre 0 y 1.
     * Indica la probabilidad con la que se colocan los actores indicados en el mapa como aleatorios.
     * El valor por defecto es 0.5.
     */
    constructor(generadorDeMapas : GeneradorDeMapas, proba = 0.5) {
        super();
        this.generadorDeMapas = generadorDeMapas;
        this.proba = proba;
    }

    iniciar() : void {
        this.fondo = new Fondo(this.archivoFondo(), 0, 0);
        this.automata = this.obtenerAutomata();
        this.mapaEscena = this.generadorDeMapas.obtenerMapa();
        this.cuadricula = this.construirCuadricula(this.mapaEscena);
		this.automata.enviarAlFrente();
        if (this.tieneAleatoriedad()) this.indicarAleatoriedad();
        this.ajustarGraficos();
    }

    construirCuadricula(mapa : MapaEscena) : Cuadricula {
        let cuadricula = new Cuadricula(this.cuadriculaX(), this.cuadriculaY(), mapa.length,
            mapa[0].length, this.opsCuadricula(), this.opsCasilla());
        cuadricula.forEachCasilla(casilla => this.llenarCasilla(cuadricula, casilla, mapa));
        return cuadricula;
    }

    llenarCasilla(cuadricula : Cuadricula, casilla : Casilla, mapa : MapaEscena) : void {
        let nroFila = casilla.nroFila;
        let nroColumna = casilla.nroColumna;
        let codigo = mapa[nroFila][nroColumna];

        if (codigo == '' || codigo == ' ') return; // si es casilla libre

        if (codigo.slice(-1) == '?') { // si debe ser randomizado 
            codigo = codigo.slice(0, -1);
            if (Math.random() > this.proba) return;
        }

        let actor;
        if (codigo in this.mapeoCuadricula()) {
            actor = this.mapeoCuadricula()[codigo](nroFila, nroColumna);
        }
        else if ('default' in this.mapeoCuadricula()) {
            actor = this.mapeoCuadricula()['default'](nroFila, nroColumna, codigo);
        }
        else {
            throw Error("Código de actor no definido en diccionarioContenido");
        }

        cuadricula.agregarActorEnCasilla(actor, casilla, true);
    }

    tieneAleatoriedad() : boolean {
        return this.generadorDeMapas.tieneAleatoriedad() ||
            this.mapaEscena.some(fila => fila.some(item => item.slice(-1) == '?'));
    }

    /**
     * Indica al usuario que la escena cuenta con aleatoriedad. Se puede sobreescribir.
     */
    indicarAleatoriedad() : void {
        new FlechaEscenarioAleatorio();
    }

    /**
     * Crea y devuelve el autómata de la actividad.
     */
    abstract obtenerAutomata() : ActorAnimado;

    /**
     * Devuelve un diccionario que mapea cada identificador con la función que obtiene a cada actor.
     * Importante: el actor debe crearse AL LLAMAR A ESA FUNCION, y no antes.
     * La función recibirá hasta tres parámetros: el número de fila y el número de columna
     * de la casilla donde se colocará el actor, respectivamente, y luego el código
     * presente en el mapa en la posición actual de la matriz,
     * Se puede usar el identificador 'default' para brindar una función a utilizar
     * cuando la matriz contiene un código que no está presente en el diccionario.
     */
    abstract mapeoCuadricula() : MapeoCuadricula;

    /**
     * Se puede sobreescribir esta función para indicar acciones que se realizarán
     * justo después de iniciar la escena para mejorar su aspecto visual. Por ejemplo,
     * ajustar la escala o la posición de los actores. Por defecto, no hace nada.
     */
    ajustarGraficos() : void {};
    
    /** Devuelve el path del archivo que se usará como fondo de la escena. */
    abstract archivoFondo() : string;

    /** Devuelve la posición en el eje X de la cuadrícula. Se puede sobreescribir. */
    cuadriculaX(): number { return 0; }

    /** Devuelve la posición en el eje X de la cuadrícula. Se puede sobreescribir. */
    cuadriculaY() : number { return 0; }

    /** Devuelve las opciones que se usarán para crear la cuadrícula. Se puede sobreescribir. */
    opsCuadricula() : any { return {}; }

    /** Devuelve las opciones que se usarán para crear la casilla. Se puede sobreescribir. */
    opsCasilla(): any { return { grilla: 'invisible.png' }; }
}


interface GeneradorDeMapas {
    obtenerMapa() : MapaEscena;
    tieneAleatoriedad() : boolean;
}

class GeneradorDeMapasSimple implements GeneradorDeMapas {
    mapa : MapaEscena;
    constructor(mapa : MapaEscena) { this.mapa = mapa; }
    obtenerMapa() { return this.mapa; }
    tieneAleatoriedad() { return false; }
}

class GeneradorDeMapasArray implements GeneradorDeMapas {
    mapas: Array<MapaEscena>;
    constructor(mapas : Array<MapaEscena>) { this.mapas = mapas; }
    obtenerMapa() { return this.mapas[Math.floor(Math.random() * this.mapas.length)]; }
    tieneAleatoriedad() { return this.mapas.length > 1; }
}
