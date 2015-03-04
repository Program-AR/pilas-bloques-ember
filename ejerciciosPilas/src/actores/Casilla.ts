/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class Casilla extends ActorAnimado {
    constructor(x,y,opciones){
        opciones.grilla = opciones.grilla || "invisible.png";
        super(x,y,opciones);
        
    }
}