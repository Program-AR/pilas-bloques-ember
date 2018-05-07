/// <reference path = "../../../dependencias/pilasweb.d.ts" />

/**
 * Actor que representa una letra en una cuadrícula.
 */
class Letra extends ActorAnimado {
    private _caracter : string;
    private static _caracteresValidos: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ";

    /**
     * @param unString Indica la letra que será representada por el actor (case insensitive).
     */
    constructor(unString : string) {
        super(0, 0, {
            grilla: "actor.letra.png",
            cantColumnas: Letra._caracteresValidos.length,
            cantFilas: 1,
            cuadrosParado: [Letra.indiceDeCaracter(Letra.primerLetraDeString(unString))]
        });
        this._caracter = Letra.primerLetraDeString(unString);
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
        if (this.indiceDeCaracter(caracter)>=0) {
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
        return this._caracteresValidos.indexOf(unString);
    }
}