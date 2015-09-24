

/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Obrero.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts"/>

/**
 * @class LightBot
 *
 */
class SuperTito1 extends Base {
    fondo;
    automata;
    cuadricula;
    cantidadFilas;
    estado;

    iniciar() {
        this.estado=undefined;

        this.fondo = new Fondo('fondos.estrellas.png',0,0);
        var cantidadMaxFilas=7;
        this.cantidadFilas= Math.floor((Math.random() * cantidadMaxFilas) + 2)
        this.cuadricula = new Cuadricula(pilas.opciones.arriba-40,0,this.cantidadFilas,1,
        {separacionEntreCasillas: 5},
        {grilla: 'casilla.grisoscuro.png',
        cantColumnas: 1,  ancho:50, alto:50});
        this.automata = new Robot(0,0);
        this.cuadricula.agregarActor(this.automata,0,0);
        for (let i = 1; i < this.cantidadFilas-1; i++) {
            this.cuadricula.agregarActor(new CasillaConLuz(0,0),i,0);
        }
        this.cuadricula.casilla(this.cantidadFilas-1,0).cambiarImagen('casilla.titoFinalizacion.png');




    }

}
