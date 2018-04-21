/// <reference path = "../../../dependencias/pilasweb.d.ts" />

/**
 * Actor que representa una letra en una cuadrícula.
 */
class Letra extends ActorAnimado {
    private _caracter : string;

    /**
     * @param unString Indica la letra que será representada por el actor (case insensitive).
     */
    constructor(unString : string) {
        let caracter = Letra.primerLetraDeString(unString);
        super(0, 0, {
            grilla: "actor.letra.png",
            cantColumnas: 26,
            cantFilas: 1,
            cuadrosParado: [Letra.indiceDeCaracter(caracter)]
        });
        this._caracter = caracter;
    }

    /**
     * Devuelve la letra representada por el actor (en mayúsculas).
     */
    caracter() : string {
        return this._caracter;
    }

    /**
     * Auxiliar para recuperar la primer letra de un string, en mayúsculas.
     * Falla si no es una letra.
     */
    private static primerLetraDeString(unString: string) : string {
        let caracter = unString[0].toUpperCase();
        if (caracter.charCodeAt(0) >= 65 && caracter.charCodeAt(0) <= 90) {
            return caracter;
        }
        else {
            throw Error("El caracter proporcionado no es una letra");
        }
    }

    /**
     * Convierte una letra en mayúsculas a un código numérico.
     * A => 0, B => 1, C => 2 y así sucesivamente.
     */
    private static indiceDeCaracter(unString : string) : number {
        return unString.charCodeAt(0) - 65;
    }
}