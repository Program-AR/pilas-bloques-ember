/// <reference path="ActorAnimado.ts"/>

class Lamparin extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'lamparin.png', cantColumnas:2, cantFilas: 1});
        
        this.definirAnimacion("apagada",[0],1);
        this.definirAnimacion("prendida",[1],1);
        this.etiquetas.push('Luz');

    }
} 