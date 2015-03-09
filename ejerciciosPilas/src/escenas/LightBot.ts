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
        //this.robot.izquierda = pilas.izquierda();

        this.cuadricula = new Cuadricula(0,0,1,7,
            {alto: 70},
            {grilla: 'casillaLightbot.png', 
            cantColumnas: 5})
        
        this.robot = new Obrero(0,0);
        this.robot.setCuadricula(this.cuadricula,0,0);
        //this.robot.aprender(AvisaAlSalirDePantalla,{});
    }
    
    irArriba(){
        this.robot.hacer_luego(MoverACasillaArriba);
    }
    irAbajo(){
        this.robot.hacer_luego(MoverACasillaAbajo);
    }
    irDerecha(){
        this.robot.hacer_luego(MoverACasillaDerecha);
    }
    irIzquierda(){
        this.robot.hacer_luego(MoverACasillaIzquierda);
    }
}