/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>


/**
 * @class LaberintoCorto
 * 
 */
class LaberintoCorto extends Base {
    fondo;
    perro;
    cuadricula;
        
    iniciar() {
        this.fondo = new Fondo('fondos/nubes.png',0,0);
        //this.robot.izquierda = pilas.izquierda();

        this.cuadricula = new Cuadricula(0,0,1,7,
            {alto: 70},
            {grilla: 'casillaLightbot.png', 
            cantColumnas: 5})
        
        this.perro = new PerroCohete(0,0);
        this.perro.setCuadricula(this.cuadricula,0,0);
        //this.robot.aprender(AvisaAlSalirDePantalla,{});
    }
    
    irArriba(){
        this.perro.hacer_luego(MoverACasillaArriba);
    }
    irAbajo(){
        this.perro.hacer_luego(MoverACasillaAbajo);
    }
    irDerecha(){
        this.perro.hacer_luego(MoverACasillaDerecha);
    }
    irIzquierda(){
        this.perro.hacer_luego(MoverACasillaIzquierda);
    }
}