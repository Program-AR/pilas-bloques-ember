/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Tito.ts"/>
/// <reference path = "../actores/CasillaConLuz.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>

/**
 * @class LightBot
 *
 */
class SuperTito1 extends EscenaActividad {
    fondo;
    automata;
    cuadricula;
    cantidadFilas;
    estado;

    iniciar() {
        this.estado=undefined;

        this.fondo = new Fondo(this.pathFondo(),0,0);
        var cantidadMaxFilas=5;
        this.cantidadFilas= Math.floor((Math.random() * cantidadMaxFilas) + 3)
        this.cuadricula = new Cuadricula(0,0,this.cantidadFilas,1,
        {separacionEntreCasillas: 5},
        {grilla: 'casilla.grisoscuro.png',
        cantColumnas: 1,  ancho:100, alto:50});
        this.cuadricula.casilla(this.cantidadFilas-1,0).cambiarImagen('casilla.titoFinalizacion.png');
        this.automata = new Tito(0,0);
        this.cuadricula.agregarActor(this.automata,0,0);
        this.automata.escala *= 2;
        this.automata.y += 30;
        this.automata.x -= 15;
        for (let i = 0; i < this.cantidadFilas-1; i++) {
            this.agregarLamparinEnFila(i);
        }

    }

    agregarLamparinEnFila(i){
        var lamparin = new CasillaConLuz(0, 0);
        this.cuadricula.agregarActor(lamparin, i, 0);
        lamparin.x += 15;
    }

    pathFondo(){
        return 'fondo.superTito1.png';
    }

}
