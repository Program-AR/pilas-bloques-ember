/// <reference path = "EscenaToto.ts" />

class EscenaTotoEscritor extends EscenaToto {
    manoQueEscribe : Actor;

    iniciar(){
        super.iniciar();
        this.manoQueEscribe = new ActorAnimado(0,0,{grilla: "manoToto.png"});
        this.cuadriculaSecundaria.agregarActor(this.manoQueEscribe,0,0,false);
        this.manoQueEscribe.escalarAAncho(150);
        this.manoQueEscribe.setY(this.manoQueEscribe.getY()+40);
        this.manoQueEscribe.setX(this.manoQueEscribe.getX()+70);
    }

    pathCuadriculaSecundaria() : string {
        return "libroToto.png";
    }

    pathGrillaCasilla() : string {
        return 'casilla.mono.contar.png';
    }
}


class EscribirTextoDadoEnOtraCuadricula extends EscribirTexto {
    iniciar(receptor){
        this.argumentos.texto = this.argumentos.texto || pilas.escena_actual().automata.caracterActual();
        this.argumentos.receptor = pilas.escena_actual().manoQueEscribe;
        super.iniciar(this.argumentos.receptor);
    }
}