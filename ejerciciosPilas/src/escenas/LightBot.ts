/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Obrero.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>


/**
 * @class LightBot
 * 
 */
class LightBot extends Base {
    fondo;
    robot;
    cuadricula;
        
    iniciar() {
        this.fondo = new Fondo('fondos/nubes.png',0,0);
        //this.robot = new Robot(0,0);
        //this.robot.izquierda = pilas.izquierda();

        this.cuadricula = new Cuadricula(0,0,2,4,
            {grillaCasilla: 'banana.png', 
            cantCuadrosCasilla: 2})
        //this.robot.aprender(AvisaAlSalirDePantalla,{});
    }
}