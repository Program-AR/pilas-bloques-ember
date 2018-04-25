/// <reference path = "../EscenaActividad.ts" />
/// <reference path = "../../actores/libroPrimaria/Toto.ts" />
/// <reference path = "../../actores/libroPrimaria/Letra.ts" />
/// <reference path = "../../actores/CuadriculaAutoLlenante.ts" />

/**
 * En esta escena, el zorro Toto se mueve por una cuadrícula de letras y las va leyendo.
 * A medida que el zorro lee las letras, estas van apareciendo en otra cuadrícula.
 */
class EscenaTotoLector extends EscenaActividad {
    automata : Toto;
    mapaEscena : Array<Array<string>>;
    textoObjetivo : string;
    topeDeLetras : number;
    cuadriculaLectura : Cuadricula; // En esta cuadrícula van apareciendo las letras a medida que Toto lee.

    /**
     * @param mapaEscena Matriz bidimensional de strings a partir de la cual se crea la escena.
     * Toto se representa con una 'A' mayúscula. Las letras a leer van en minúscula
     * ('a', 'b', etc.). Los strings ' ' y '' representan casillas vacías.
     * @param textoObjetivo El texto que Toto debe leer. 
     * @param topeDeLetras Cantidad máxima de letras que Toto puede leer. Es opcional; por defecto
     * se toma la longitud de `textoObjetivo`.
     */
    constructor(
        mapaEscena : Array<Array<string>>,
        textoObjetivo : string,
        topeDeLetras : number = 0
    ) {
        super();
        this.mapaEscena = mapaEscena;
        this.textoObjetivo = textoObjetivo;
        this.topeDeLetras = topeDeLetras > 0 ? topeDeLetras : this.textoObjetivo.length;
    }

    iniciar() {
        this.fondo = new Fondo(this.pathFondo(), 0, 0);
        this.automata = new Toto();

        this.cuadricula = this.construirCuadricula();
        this.cuadricula.autollenar(
            this.mapaEscena,
            {
                'A' : () => this.automata,
                'default': codigo => new Letra(codigo)
            }
        );
        this.automata.enviarAlFrente();

        this.cuadriculaLectura = this.construirCuadriculaLectura();
        // Toto debe conocer la cuadrícula de lectura (ver comportamiento 'MovimientoConLectura').
        this.automata.cuadriculaLectura = this.cuadriculaLectura;
    }

    construirCuadricula() : Cuadricula {
        return new Cuadricula(
            0, 80, this.mapaEscena.length, this.mapaEscena[0].length,
            { ancho: 400, alto: 300 }, { grilla: 'casillas.violeta.png' }
        );
    }

    construirCuadriculaLectura() : Cuadricula {
        return new Cuadricula(
            -20, -170, 1, this.topeDeLetras,
            { alto: 60 }, { ancho: 40, grilla: 'invisible.png' }
        );
    }

    pathFondo(){
        return "fondo.totoLector.png";
    }

    /**
     * Devuelve en forma de string el contenido actual de la cuadrícula de lectura.
     */
    textoLeido() : string {
        let texto = "";
        this.cuadriculaLectura
            .filterCasillas(casilla => casilla.tieneActorConEtiqueta("Letra"))
            .forEach(casilla =>
                texto += casilla.actoresConEtiqueta("Letra")[0].caracter()
            );
        return texto;
    }

    estaResueltoElProblema() {
        return this.textoLeido() == this.textoObjetivo.toUpperCase();
    }
}