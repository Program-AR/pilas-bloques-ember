/// <reference path = "EscenaToto.ts" />
/// <reference path = "../../actores/libroPrimaria/Toto.ts" />
/// <reference path = "../../actores/libroPrimaria/Letra.ts" />

/**
 * En esta escena, el zorro Toto se mueve por una cuadrícula de letras y las va leyendo.
 * A medida que el zorro lee las letras, estas van apareciendo en otra cuadrícula.
 */
class EscenaTotoLector extends EscenaToto {

	static clasesDeActoresExtrasToto() : typeof ActorAnimado[] {
		return [LetraLeida]
    }

	static imagenesAdicionalesToto() : string[]{
		return ['pensamientoToto.png']
    }

    obtenerAutomata() : TotoLector {
        return new TotoLector();
    }

    construirCuadriculaSecundaria(): Cuadricula {
        new ActorAnimado(0, -160, { grilla: "pensamientoToto.png" })
        return new Cuadricula(
            70, -160, 1, this.topeDeLetras,
            { alto: 160, ancho: 210, imagen: 'invisible.png', separacionEntreCasillas: -24 }, { grilla: 'invisible.png', relAspecto: 1 }
        );
    }
}
