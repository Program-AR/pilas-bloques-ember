/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Obrero.ts"/>

/**
 * @class LightBot
 * 
 */
class LightBot extends Base {
    fondo;
    robot;
    pizarra;
    pizarra2;
    
    iniciar() {
        this.fondo = new Fondo('fondos/nubes.png',0,0);
        //this.robot = new Robot(0,0);
        //this.robot.izquierda = pilas.izquierda();
        
        //new Casilla(0,0,{});
        new Obrero(100,100);
        this.pizarra = new Pizarra(0,0);
        this.pizarra.rectangulo(100,100,150,150);
        
        new Obrero(-100,-100);
        this.pizarra2 = new Pizarra(0,0);
        this.pizarra2.rectangulo(-100,-100,150,150);
        //this.robot.aprender(AvisaAlSalirDePantalla,{});
    }
}