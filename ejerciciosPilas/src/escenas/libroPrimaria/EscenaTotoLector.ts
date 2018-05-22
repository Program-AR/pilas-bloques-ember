/// <reference path = "EscenaToto.ts" />
/// <reference path = "../../actores/libroPrimaria/Toto.ts" />
/// <reference path = "../../actores/libroPrimaria/Letra.ts" />

/**
 * En esta escena, el zorro Toto se mueve por una cuadrícula de letras y las va leyendo.
 * A medida que el zorro lee las letras, estas van apareciendo en otra cuadrícula.
 */
class EscenaTotoLector extends EscenaToto {
    obtenerAutomata() : TotoLector {
        return new TotoLector();
    }

    pathCuadriculaSecundaria(){
        return "pensamientoToto.png";
    }

    pathGrillaCasilla(){
        return 'casillas.violeta.png';
    }
}
