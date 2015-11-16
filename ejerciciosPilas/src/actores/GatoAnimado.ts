/// <reference path="ActorAnimado.ts"/>




class GatoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'gatoAnimado.png', cantColumnas:7, cantFilas: 7});
        this.definirAnimacion('parado',[0,1,2,3,0,1,2,3,0,1,2,3,8,9,10,11,12],5);
        this.definirAnimacion('saltar',[14,15,16],5);
        this.definirAnimacion('saludando',[15,16,16,17,18,19,19,18,17,16,16,16,16,17,18,19,19],5);
        this.definirAnimacion('acostado',[4,6,4],5);
        this.definirAnimacion('abrirOjos',[43,44,45,46],5);
        
        this.definirAnimacion('cerrarOjos',[36,37,38,39],5);
        this.definirAnimacion('correr',[22,23,24,25,26],6);
        this.definirAnimacion('volver',[28,29,30,31,32,33,34,35],6);

    }
}
