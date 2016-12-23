class BotonAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'actores/actor.BotonAnimado.png', cantColumnas:2});
        this.definirAnimacion("apagada",[0],1);
        this.definirAnimacion("prendida",[1],1);
    }


}
