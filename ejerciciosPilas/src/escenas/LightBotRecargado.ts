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
    personaje;
    cuadricula;
    objetos = [];
        
    iniciar() {
        this.fondo = new Fondo('fondos.estrellas.png',0,0);
        //this.robot.izquierda = pilas.izquierda();

        this.cuadricula = new Cuadricula(0,0,1,11,
            {},
            {grilla: 'casilla_base.png', 
            cantColumnas: 1, alto: 38});
        

        //se cargan las luces
        for(var i = 0; i < 11; i++) {
            if (Math.random() < .5) {
                this.agregarLuz(i);
            }
        }

        // se crea el personaje
        this.personaje = new Robot(0,0);
        this.cuadricula.agregarActor(this.personaje,0,0);
    }

    agregarLuz(columna) {
        var casillaLuminosa = new CasillaConLuz(0,0);
        this.cuadricula.agregarActor(casillaLuminosa,0,columna);
        casillaLuminosa.escala_x = .50;
        casillaLuminosa.escala_y = .50;
        this.objetos.push(casillaLuminosa);
    }

    avanzar() {
        this.personaje.hacer_luego(MoverACasillaDerecha);
    }
    
    prenderLuz() {
        this.personaje.hacer_luego(EncenderLuz);
    }

}