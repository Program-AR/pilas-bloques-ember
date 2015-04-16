/// <reference path = "../../dependencias/pilasweb.d.ts"/>

/**
 * @class ElMarcianoEnElDesierto
 * 
 * Objetivos: Ejercitarse en el uso de programas para la resolución de problemas.
 * Enunciado: Comer todas las manzanas del tablero.
 */
class ElMarcianoEnElDesierto extends Base {
    fondo;
    personaje;
    cuadricula;
    manzanas;

    iniciar() {
        this.fondo = new Fondo('fondos/nubes.png',0,0);
        var cantidadFilas=4;
        var cantidadColumnas=5;

        this.cuadricula = new Cuadricula(0,0,cantidadFilas,cantidadColumnas,{},
            {grilla: 'casillaLightbot.png', 
            cantColumnas: 5, 
            ancho: 50, 
            alto: 50})

        this.manzanas=[];
        var objeto= new ManzanaAnimada(0,0);
        objeto.setCuadricula(this.cuadricula,0,0);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        objeto.setCuadricula(this.cuadricula,0,2);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        objeto.setCuadricula(this.cuadricula,0,4);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        objeto.setCuadricula(this.cuadricula,1,4);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        objeto.setCuadricula(this.cuadricula,2,4);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        objeto.setCuadricula(this.cuadricula,3,2);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        objeto.setCuadricula(this.cuadricula,3,1);
        this.manzanas.push(objeto);

        this.personaje = new Marciano(0,0);
        this.personaje.setCuadricula(this.cuadricula,cantidadFilas-1,0);
    }

/*************** Métodos para que se cuelgue blockly ****************/
/****** Deben tener sólo una línea, que sea un "hacer_luego" ********/
/****** El nombre debe ser el que tendrá el bloque en blockly *******/

    irDerecha() {
        this.personaje.hacer_luego(MoverACasillaDerecha);
    }

    irIzquierda() {
        this.personaje.hacer_luego(MoverACasillaIzquierda);
    }

    irArriba() {
        this.personaje.hacer_luego(MoverACasillaArriba);
    }

    irAbajo() {
        this.personaje.hacer_luego(MoverACasillaAbajo);
    }

    comerManzana() {
        this.personaje.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'ManzanaAnimada', 'mensajeError' : 'No hay una manzana aqui' });
    }

}