/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path="ActorAnimado.ts"/>
/// <reference path = "../comportamientos/Animar.ts"/>


class Obrero extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'cooperativista/camina.png', cantColumnas: 4});
        
        this.definirAnimacion("correr",[0,1,2,3,2,1],15);
        this.definirAnimacion("parado",[3],5);
    }
    
    argumentosMartillar(){
        return {grilla: 'cooperativista/trabajando.png', cantColumnas: 2};
    }
} 