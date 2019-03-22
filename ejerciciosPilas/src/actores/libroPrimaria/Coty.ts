/// <reference path="../ActorAnimado.ts"/>
/// <reference path="../../comportamientos/Decir.ts"/>

class Coty extends ActorAnimado {
    static _grilla = 'actor.coty.png';
    
    constructor(x = 0, y = 0) {
        super(x, y, { cantColumnas: 10, cantFilas: 10 });
        this.definirAnimacion("parado",
            new Cuadros(0).repetirVeces(16)
                .concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
                .concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
                .concat(new Cuadros(0).repetirVeces(32))
                .concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
                .concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
                .concat(new Cuadros(0).repetirVeces(32))
                .concat([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49])
                .concat(new Cuadros(0).repetirVeces(5)),
            12, true);
        this.definirAnimacion("correrDibujando", [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62], 12);
        this.definirAnimacion("saltar", [63, 64, 65, 66, 67, 68, 69, 69, 69, 70, 71, 72, 73, 74, 75, 76, 77], 14);
        this.definirAnimacion("obstaculo", [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100], 7.5);
        this.definirAnimacion("rotar", [0], 1);
    }

}
