/// <reference path = "../../dependencias/pilasweb.d.ts"/>

/**
 * @class ElMarcianoEnElDesierto
 *
 * Objetivos: Ejercitarse en el uso de programas para la resolución de problemas.
 * Enunciado: Comer todas las manzanas del tablero.
 */
class ElMarcianoEnElDesierto extends Base {
    fondo;
    automata;
    cuadricula;
    manzanas;
    estado;
    iniciar() {
      this.estado=undefined;
        this.fondo = new Fondo('fondos.nubes.png',0,0);
        var cantidadFilas=4;
        var cantidadColumnas=5;

        this.cuadricula = new Cuadricula(0,0,cantidadFilas,cantidadColumnas,{},
            {grilla: 'casillaLightbot.png',
            cantColumnas: 5,
            ancho: 60,
            alto: 60})

        this.manzanas=[];
        var objeto= new ManzanaAnimada(0,0);
        this.cuadricula.agregarActor(objeto,0,0);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        this.cuadricula.agregarActor(objeto,0,2);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        this.cuadricula.agregarActor(objeto,0,4);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        this.cuadricula.agregarActor(objeto,1,4);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        this.cuadricula.agregarActor(objeto,2,4);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        this.cuadricula.agregarActor(objeto,3,2);
        this.manzanas.push(objeto);

        var objeto= new ManzanaAnimada(0,0);
        this.cuadricula.agregarActor(objeto,3,1);
        this.manzanas.push(objeto);

        this.automata = new MarcianoAnimado(0,0);
        this.cuadricula.agregarActor(this.automata,cantidadFilas-1,0);

    }

}
