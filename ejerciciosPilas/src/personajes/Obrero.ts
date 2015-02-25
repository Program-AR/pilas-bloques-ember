/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path="ActorAnimado.ts"/>
/// <reference path = "../comportamientos/Animar.ts"/>


class Obrero extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'cooperativista/camina.png', cantCuadros: 4});
        this.espejado = true;
    }
    
    martillar(){
        this.hacer_luego(Animar,{grilla: 'cooperativista/trabajando.png', cantCuadros: 2});
    }
} 