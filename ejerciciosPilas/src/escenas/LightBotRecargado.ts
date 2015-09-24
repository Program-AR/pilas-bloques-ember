/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/Robot.ts"/>
/// <reference path = "../actores/CasillaConLuz.ts"/>
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts"/>


/**
 * @class LightBotRecargado
 *
 */
class LightBotRecargado extends Base {
    fondo;
    automata;
    cuadricula;
    objetos = [];

    iniciar() {
        this.fondo = new Fondo('fondos.estrellas.png',0,0);
        //this.robot.izquierda = pilas.izquierda();
        this.cuadricula = new Cuadricula(0,0,8,1,
        {separacionEntreCasillas: 5,alto:pilas.opciones.alto-40},
        {grilla: 'casilla.grisoscuro.png',
        cantColumnas: 1,  ancho:50, alto:50});

        //se cargan las luces
        for(var i = 1; i < 8; i++) {
            if (Math.random() < .5) {
                this.agregarLuz(i);
            }
        }

        // se crea el automata
        this.automata = new Robot(0,0);
        this.cuadricula.agregarActor(this.automata,0,0,true);
    }

    agregarLuz(fila) {
        var casillaLuminosa = new CasillaConLuz(0,0);
        this.cuadricula.agregarActor(casillaLuminosa,fila,0);
        casillaLuminosa.escala_x = .50;
        casillaLuminosa.escala_y = .50;
        this.objetos.push(casillaLuminosa);
    }

    avanzar() {
        this.automata.hacer_luego(MoverACasillaDerecha);
    }

    prenderLuz() {
        this.automata.hacer_luego(EncenderLuz);
    }

}
