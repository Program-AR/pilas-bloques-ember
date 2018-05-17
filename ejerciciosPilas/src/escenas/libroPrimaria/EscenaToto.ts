/// <reference path = "../EscenaActividad.ts" />
/// <reference path = "../../actores/libroPrimaria/Toto.ts" />
/// <reference path = "../../actores/libroPrimaria/Letra.ts" />
/// <reference path = "../../actores/CuadriculaAutoLlenante.ts" />

/**
 * En esta escena, el zorro Toto se mueve por una cuadrícula de letras y las va leyendo.
 * A medida que el zorro lee las letras, estas van apareciendo en otra cuadrícula.
 */
abstract class EscenaToto extends EscenaActividad {
    automata : Toto;
    mapaEscena : Array<Array<string>>;
    textoObjetivo : string;
    topeDeLetras : number;
    cuadriculaSecundaria : Cuadricula; // En esta cuadrícula van apareciendo las letras a medida que Toto lee.

    /**
     * @param mapaEscena Matriz bidimensional de strings a partir de la cual se crea la escena.
     * Toto se representa con una 'A' mayúscula. Las letras a leer van en minúscula
     * ('a', 'b', etc.). Los strings ' ' y '' representan casillas vacías.
     * @param textoObjetivo El texto que Toto debe leer. 
     * @param topeDeLetras Cantidad máxima de letras que Toto puede leer. Es opcional; por defecto
     * se toma la longitud de `textoObjetivo`.
     */
    constructor(
        mapaEscena : MapaEscena,
        textoObjetivo : string,
        topeDeLetras : number = 0
    ) {
        super();
        this.mapaEscena = mapaEscena;
        this.textoObjetivo = textoObjetivo;
        this.topeDeLetras = topeDeLetras > 0 ? topeDeLetras : this.textoObjetivo.length;
    }

    iniciar() {
        this.fondo = new Fondo('fondo.toto.png', 0, 0);
        this.automata = this.crearAutomata();
        
        this.cuadricula = this.construirCuadricula();
        this.cuadricula.autollenar(
            this.mapaEscena,
            {
                'A' : () => this.automata,
                'default': codigo => new Letra(codigo)
            }
        );
        this.automata.enviarAlFrente();
        this.automata.escala *= this.escalaSegunCuadricula(1.8);

        this.cuadriculaSecundaria = this.construirCuadriculaSecundaria();
        // Toto debe conocer la cuadrícula secundaria (ver comportamiento 'MovimientoConLectura').
        this.automata.cuadriculaSecundaria = this.cuadriculaSecundaria;
    }

    construirCuadricula() : Cuadricula {
        return new Cuadricula(
            0, 80, this.mapaEscena.length, this.mapaEscena[0].length,
            { ancho: 400, alto: 300 }, 
            { grilla: this.pathGrillaCasilla(), alto: this.mapaEscena.length === 1 ? 70 : undefined, relAspecto: 1 }
        );
    }

    construirCuadriculaSecundaria() : Cuadricula {
        return new Cuadricula(
            0, -170, 1, this.topeDeLetras,
            { alto: 160 , ancho: 380, imagen: this.pathCuadriculaSecundaria()}, { grilla: 'invisible.png' }
        );
    }

    /**
     * Crea y devuelve el autómata de la actividad
     */
    abstract crearAutomata() : Toto;

    /**
     * Retorna el nombre de la imagen correspondiente al fondo de la cuadrícula secundaria.
     */
    abstract pathCuadriculaSecundaria() : string;

    /**
     * Retorna el nombre de la imagen correspondiente a las casillas sobre las que camina Toto.
     */
    abstract pathGrillaCasilla() : string

    /**
     * Devuelve en forma de string el contenido actual de la cuadrícula secundaria.
     */
    textoEnCuadriculaSecundaria() : string {
        let texto = "";
        this.cuadriculaSecundaria
            .filterCasillas(casilla => casilla.tieneActorConEtiqueta("Letra"))
            .forEach(casilla =>
                texto += casilla.actoresConEtiqueta("Letra")[0].caracter()
            );
        return texto;
    }

    estaResueltoElProblema() {
        return this.textoEnCuadriculaSecundaria() == this.textoObjetivo.toUpperCase();
    }
}
