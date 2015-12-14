/// <reference path = "SuperTito1.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>

/**
 * @class SuperTito2
 *
 */
class SuperTito2 extends SuperTito1 {
    hayLuz;

    iniciar(){
        super.iniciar();
        this.hayLuz = false;
    }

    pathFondo(){
        return 'fondo.superTito2.png';
    }

    agregarLamparinEnFila(i){
        if (Math.random() < 0.5 || (i == this.cantidadFilas - 2 && !this.hayLuz)) {
            super.agregarLamparinEnFila(i);
            this.hayLuz = true;
        }
    }


}
