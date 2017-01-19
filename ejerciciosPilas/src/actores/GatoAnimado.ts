/// <reference path="ActorAnimado.ts"/>




class GatoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'gatoAnimado.png', cantColumnas:7, cantFilas: 7});
        this.definirAnimacion('parado',new Cuadros([0,1,2,3,2,1]).repetirVeces(9).concat([8,9,10,11,12,12,12,12,12,12,11,10,9,8]),4,true);
        this.definirAnimacion('saltar',[43,44,45,46,46,46,46,46,45,44,43],15);
        this.definirAnimacion('saludando',[15,16,16,17,18,19,19,18,17,16,16,16,16,17,18,19,19,16,15],5);
        this.definirAnimacion('acostado',[8,9,10,11,12,11,10,9,8],5);
        this.definirAnimacion('abrirOjos', [39, 38, 37, 36], 5);
        this.definirAnimacion('ojosCerrados', [39], 5);
        this.definirAnimacion('cerrarOjos', [36, 37, 38, 39], 5);
        this.definirAnimacion('correr',[22,23,24,25,26],6);
    }
}
