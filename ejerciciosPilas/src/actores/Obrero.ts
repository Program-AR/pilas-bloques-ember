/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path="ActorAnimado.ts"/>

class Obrero extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'actores/actor.CooperativistaCamina.png', cantColumnas: 4});

        this.definirAnimacion("correr",[0,1,2,3,2,1],15);
        this.definirAnimacion("parado",[3],5);
    }

    restaurar() {
      var grilla = pilas.imagenes.cargar_grilla('actores/actor.CooperativistaCamina.png', 4);
      this.imagen = grilla;
    }

    argumentosMartillar(){
        return {grilla: 'actores/actor.CooperativistaTrabajando.png', cantColumnas: 2};
    }

    fraseAlSaltar(){
    	return pilas.escena_actual().fraseAlSaltar();
    }
}
