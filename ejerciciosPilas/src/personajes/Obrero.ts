/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path="ActorAnimado.ts"/>


class Obrero extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'cooperativista/camina.png', cantCuadrosCorrer: 4});
        this.espejado = true;
    }
} 