/// <reference path="ActorAnimado.ts"/>

class PerroCohete extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'perro_cohete.png', cantColumnas:1, cantFilas: 4, cuadroEstatico: 3});
    }
} 