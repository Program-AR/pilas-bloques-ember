/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>


/**
 * @class TresNaranjas
 * 
 */
class TresNaranjas extends Base {
    fondo;
    personaje;
    cuadricula;
    objetos;
        
    iniciar() {
        this.fondo = new Fondo('fondos/nubes.png',0,0);
        //this.robot.izquierda = pilas.izquierda();

        this.cuadricula = new Cuadricula(0,0,1,4,
            {alto: 70},
            {grilla: 'casillaLightbot.png', 
            cantColumnas: 5});
        
        //se cargan las naranjas
        this.objetos =  [];
        for(var i = 0; i < 3; i++) {
            if (Math.random() < .5) {
                var objeto = new Hueso(0,0);
                objeto.setCuadricula(this.cuadricula,0,i+1);
                this.objetos.push(objeto);
            }
        }

        this.personaje = new PerroCohete(0,0);
        this.personaje.setCuadricula(this.cuadricula,0,0);
        //this.robot.aprender(AvisaAlSalirDePantalla,{});
    }

    intentaronRecoger() {
        if (this.tocandoNaranja()) {
            var objeto = this.objetos.find(objeto => objeto.colisiona_con(this.personaje));
            objeto.eliminar();
        } else {
            this.personaje.decir("¡No hay hueso para comer!")
        }
    }
    
    comerNaranja() {
        this.personaje.hacer_luego(Recoger);
    }

    tocandoNaranja() {
        return this.objetos.some(objeto => objeto.colisiona_con(this.personaje));
    }

    avanzar() {
        this.personaje.hacer_luego(MoverACasillaDerecha);
    }
}