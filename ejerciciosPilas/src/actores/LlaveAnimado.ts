/// <reference path="ActorAnimado.ts"/>
/// <reference path="../habilidades/Flotar.ts"/>

class LlaveAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'llaveAnimada.png', cantColumnas:1});
        this.definirAnimacion("recoger", [1], 12);
        this.definirAnimacion("correr", [1], 12);
        this.definirAnimacion("parado", [1], 12,true);
    }
}
