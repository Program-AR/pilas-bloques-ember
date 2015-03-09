/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path="ActorAnimado.ts"/>
/// <reference path = "../comportamientos/Animar.ts"/>


class Obrero extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'cooperativista/camina.png', cantColumnas: 4, cuadroEstatico: 3});
    }
    
    argumentosMartillar(){
        return {grilla: 'cooperativista/trabajando.png', cantColumnas: 2};
    }
} 