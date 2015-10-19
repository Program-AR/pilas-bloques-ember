/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Camino.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>


/**
 * @class LaberintoCorto
 *
 */

class LaberintoCorto extends Base {
    fondo;
    perro;
    cuadricula;
    cuadricula2;

    iniciar() {
        this.fondo = new Fondo('fondos.nubes.png',0,0);
        //this.robot.izquierda = pilas.izquierda();
        this.cuadricula2 = new Camino(0,0,['->','v','->','->'],2,4,
            {'alto':400,'ancho':300},
            {grilla: 'finCamino.png',cantColumnas: 1   ,'->':'casillaDerecha.png','<-':'casillaIzquierda.png','v':'casillaAbajo.png','^':'casillaArriba.png'}
            )

        this.cuadricula = this.cuadricula2.dameCamino();

        this.perro = new PerroCohete(0,0);
        this.cuadricula.agregarActor(this.perro,0,0);

    }

    irArriba(){
        this.perro.hacer_luego(MoverACasillaArriba);
    }
    irAbajo(){
        this.perro.hacer_luego(MoverACasillaAbajo);
    }
    irDerecha(){
        this.perro.hacer_luego(MoverACasillaDerecha);
    }
    irIzquierda(){
        this.perro.hacer_luego(MoverACasillaIzquierda);
    }
}
