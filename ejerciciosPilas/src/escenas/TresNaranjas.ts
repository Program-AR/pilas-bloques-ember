/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../actores/Hueso.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>


/**
 * @class TresHuesos
 *
 */
class TresNaranjas extends EscenaActividad {
    fondo;
    automata;
    cuadricula;
    objetos = [];
    estado;
    iniciar() {
        this.estado=undefined;
        this.fondo = new Fondo('fondos.nubes.png',0,0);

        this.cuadricula = new Cuadricula(0,0,1,4,
            {alto: 70},
            {grilla: 'casillas.violeta.png'});

        //se cargan los huesos
        var hayAlMenosUno = false;
        for(var i = 0; i < 3; i++) {
            if (Math.random() < .5) {
                hayAlMenosUno = true;
                this.agregarHueso(i+1);
            }
        }
        if (!hayAlMenosUno) {
            var columna = 1;
            var rand = Math.random()
            if (rand> 0.33 && rand<0.66) {
                columna = 2;
            } else if (rand > 0.66) {
                columna = 3
            }
            this.agregarHueso(columna);
        }

        // se crea el personaje
        this.automata = new PerroCohete(0,0);
        this.cuadricula.agregarActor(this.automata,0,0);
    }

    agregarHueso(columna) {
        var objeto = new Hueso(0,0);
        this.cuadricula.agregarActor(objeto,0,columna);
        this.objetos.push(objeto);
    }

    comerHueso() {
        this.automata.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'Hueso', 'mensajeError' : 'No hay un hueso aqui' });
    }

    avanzar() {
        this.automata.hacer_luego(MoverACasillaDerecha);
    }
}
