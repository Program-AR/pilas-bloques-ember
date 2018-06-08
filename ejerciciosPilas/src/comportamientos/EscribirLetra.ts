/// <reference path = "ComportamientoConVelocidad.ts"/>
/// <reference path = "../actores/libroPrimaria/Letra.ts"/>
/**
 * Comportamiento que escribe una letra en la casilla actual.
 */
class EscribirLetra extends ComportamientoConVelocidad {
    xInicial : number;

    preAnimacion(){
        super.preAnimacion();
        this.xInicial = this.receptor.getX();
    }

    darUnPaso(){
        var variacion = this.estoyEnElCuarto(1) || this.estoyEnElCuarto(4) ? 10 : -10
        this.receptor.setX(this.receptor.getX() + variacion);
    }

    /**
     * Indica en qué porción de la duración completa del comportamiento estoy. 
     * Por ejemplo, si el comportamiento dura 12 segundos, y voy por el segundo 5,
     * estoyEnElCuarto(2) es cierto, y estoyEnElCuarto(1) es falso, ya que ya pasaron los
     * primeros tres segundos.
     * @param nroCuarto Indica el número de fracción (1 = 1/4, 2=2/4, etc)
     */
    estoyEnElCuarto(nroCuarto) : boolean {
        return this._pasosRestantes > this.argumentos.cantPasos * (1 - (nroCuarto/4)) && 
            this._pasosRestantes <= this.argumentos.cantPasos * ((5-nroCuarto)/4);
    }

    setearEstadoFinalDeseado(){
        this.receptor.setX(this.xInicial);
    }

    postAnimacion() {
        super.postAnimacion();
        this.receptor.cuadricula.agregarActorEnCasilla(new LetraManuscrita(this.argumentos.caracter),this.receptor.casillaActual());
    }

}