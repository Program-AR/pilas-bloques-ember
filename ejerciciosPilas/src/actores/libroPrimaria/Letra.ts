/// <reference path = "../../actores/ActorAnimado.ts" />
/// <reference path = "../../../../bower_components/pilasweb/dist/pilasweb.d.ts" />

/**
 * Actor que representa una letra en una cuadrícula.
 */
abstract class Letra extends ActorAnimado {
    private _caracter : string;
    private static _caracteresValidos: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ ";

    /**
     * @param unString Indica la letra que será representada por el actor (case insensitive).
     */
    constructor(unString : string) {
        super(0, 0, {
            grilla: this.pathImagen(),
            cantColumnas: Letra._caracteresValidos.length,
            cantFilas: 1,
            cuadrosParado: [Letra.indiceDeCaracter(Letra.primerLetraDeString(unString))]
        });
        this._caracter = Letra.primerLetraDeString(unString);
        this.agregarEtiqueta("Letra");
    }

    /**
     * Devuelve la letra representada por el actor (en mayúsculas).
     */
    caracter() : string {
        return this._caracter;
    }

    /**
     * Permite verificar de antemano si es posible crear una instancia de Letra
     * a partir de cierto string
     */
    static esArgumentoValido(unString : string) : boolean {
        return Letra.esCaracterValido(unString[0].toUpperCase());
    }

    /**
     * Auxiliar para recuperar la primer letra de un string, en mayúsculas.
     * Falla si no es una letra.
     */
    private static primerLetraDeString(unString: string) : string {
        let caracter = unString[0].toUpperCase();
        if (Letra.esCaracterValido(caracter)) {
            return caracter;
        }
        else {
            throw Error("El cáracter proporcionado no es una letra");
        }
    }

    /**
     * Convierte una letra en mayúsculas a un código numérico.
     * A => 0, B => 1, C => 2 y así sucesivamente.
     */
    private static indiceDeCaracter(unString : string) : number {
        return this._caracteresValidos.indexOf(unString);
    }

    private static esCaracterValido(unString : string) : boolean {
        return unString.length == 1 && Letra._caracteresValidos.indexOf(unString) >= 0;
    }

    abstract pathImagen(): string; 
}


class LetraTablero extends Letra {
    pathImagen(): string {
        return "actor.letra.tablero.png";
    }
}

class LetraLeida extends Letra {
    pathImagen(): string {
        return "actor.letra.leida.png";
    }
}

class LetraManuscrita extends Letra {
    pathImagen(): string {
        return "actor.letra.manuscrita.png";
    }
}
