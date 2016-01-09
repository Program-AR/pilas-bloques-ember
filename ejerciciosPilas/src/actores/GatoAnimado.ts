/// <reference path="ActorAnimado.ts"/>




class GatoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'gatoAnimado.png', cantColumnas:7, cantFilas: 7});
        this.definirAnimacion('parado',new Cuadros([0,1,2,3]).repetirVeces(10).concat([8,9,10,11,12,11,10,9,8]),2,true);
        this.definirAnimacion('saltar',[43,44,45,46,46,45,44,43],5);
        this.definirAnimacion('saludando',[15,16,16,17,18,19,19,18,17,16,16,16,16,17,18,19,19],5);
        this.definirAnimacion('acostado',[4,6,4],5);
        this.definirAnimacion('abrirOjos',[43,44,45,46],5);
        this.definirAnimacion('cerrarOjos',[38,38,38,39,39,39],5);
        this.definirAnimacion('correr',[22,23,24,25,26],6);
        this.definirAnimacion('volver',[28,29,30,31,32,33,34,35],6);

    }
}
