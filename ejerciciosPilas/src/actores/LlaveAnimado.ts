/// <reference path="ActorAnimado.ts"/>
/// <reference path="../habilidades/Flotar.ts"/>

class LlaveAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'llave.png', cantColumnas:1});
    }
} 