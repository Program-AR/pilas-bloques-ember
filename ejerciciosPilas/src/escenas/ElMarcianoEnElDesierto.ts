/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>

/**
 * @class ElMarcianoEnElDesierto
 *
 * Objetivos: Ejercitarse en el uso de programas para la resolución de problemas.
 * Enunciado: Comer todas las manzanas del tablero.
 */
class ElMarcianoEnElDesierto extends EscenaActividad {
    fondo;
    automata;
    cuadricula;
    manzanas;
    estado;
    iniciar() {
      this.estado= new SinEstado(function(escena){return escena.cantidadObjetosConEtiqueta('ManzanaAnimada')==0;});
        this.fondo = new Fondo('fondo.elMarcianoEnElDesierto.png',0,0);
        var cantidadFilas=4;
        var cantidadColumnas=5;

        this.cuadricula = new Cuadricula(0,-9,cantidadFilas,cantidadColumnas,
            {alto: 262, ancho: 330},
            {grilla: 'invisible.png'});

        this.manzanas=[];
        var posiciones=[[0,0],[0,2],[0,4],[1,4],[2,4],[3,2],[3,1]]
        for (let i = 0; i < posiciones.length; i++) {
            var objeto=new ManzanaAnimada(0,0);posiciones[i];
            this.cuadricula.agregarActor(objeto,posiciones[i][0],posiciones[i][1]);
            objeto.escala *= 0.8;
            this.manzanas.push(objeto);

        }

        this.automata = new MarcianoAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata,cantidadFilas-1,0);
        this.automata.escala=0.8;

    }

}
