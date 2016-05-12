/// <reference path="Tablero.ts"/>
/// <reference path="../habilidades/Flotar.ts"/>

class FlechaEscenarioAleatorio extends Tablero {
    constructor() {
        super(120, 220, {imagen: 'flechaEscenarioAleatorio.png',
                     texto: "¡Ejecutá varias veces!" ,
                     separacionX: 0,
                   });
        this.aprender(Flotar,{eje: 'X', Desvio: 20});
        this.setAlto(40);
    }

    buildPuntaje(argumentos){
      this.puntaje = {ancho: 0};
    }
}
