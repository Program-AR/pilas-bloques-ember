/// <reference path = "ActorCompuesto.ts"/>

class FondoAnimado extends ActorCompuesto {
    constructor(nombre, x, y) {
		super(x, y, { subactores: [new ActorAnimado(x, y, { grilla: nombre })] });
    }
}